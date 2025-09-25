"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step, Slider } from "@/modules/types";
import { Button } from "../button";
import { ethers } from "ethers";
import { recordCourseParticipant } from "@/modules/functions";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { getRewardContract } from "@/lib/contract";

// Extended slide type for internal use
interface ExtendedSlide extends Slider {
  stepId: string;
  stepTitle: string;
  stepNumber: number;
  requiresAction: boolean;
  isLastSlideInStep: boolean;
}

const useKeenSlider = (totalSlides: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const moveToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const translateX = -currentSlide * 100;
      containerRef.current.style.transform = `translateX(${translateX}%)`;
    }
  }, [currentSlide]);

  return {
    containerRef,
    currentSlide,
    totalSlides,
    next,
    prev,
    moveToSlide,
    isFirst: currentSlide === 0,
    isLast: currentSlide === totalSlides - 1,
  };
};

const updateCourseProgress = async (
  userId: string,
  courseId: string,
  completedSteps: string[],
  verifiedSteps: string[] = []
) => {
  try {
    // First, check if record exists
    const { data: existing, error: fetchError } = await supabase
      .from("course_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new records
      console.error("Error checking existing progress:", fetchError);
      return null;
    }

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from("course_progress")
        .update({
          completed_steps: completedSteps,
          verified_steps: verifiedSteps,
          last_updated: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .select()
        .single();

      if (error) {
        console.error("Error updating course progress:", error);
        return null;
      }
      return data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from("course_progress")
        .insert({
          user_id: userId,
          course_id: courseId,
          completed_steps: completedSteps,
          verified_steps: verifiedSteps,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting course progress:", error);
        return null;
      }
      return data;
    }
  } catch (err) {
    console.error("Unexpected error updating progress:", err);
    return null;
  }
};

export const StepsSlider = ({
  steps,
  onStepComplete,
  onAllStepsComplete,
  courseId,
  userId,
}: {
  steps: Step[];
  courseId: string;
  userId: string;
  onStepComplete?: (stepId: string) => void;
  onAllStepsComplete?: () => void;
}) => {
  // Flatten all slides from all steps
  const allSlides: ExtendedSlide[] = steps.reduce((acc, step) => {
    const stepSlides = step.sliders
      .sort((a, b) => a.order_index - b.order_index)
      .map(
        (slide): ExtendedSlide => ({
          ...slide,
          stepId: step.id,
          stepTitle: step.title,
          stepNumber: step.step_number,
          requiresAction: step.requires_action,
          isLastSlideInStep: slide.order_index === step.sliders.length - 1,
        })
      );
    return [...acc, ...stepSlides];
  }, [] as ExtendedSlide[]);

  const slider = useKeenSlider(allSlides.length);
  const [completedSlides, setCompletedSlides] = useState(new Set<string>());
  const [completedSteps, setCompletedSteps] = useState(new Set<string>());
  const [verifiedSteps, setVerifiedSteps] = useState(new Set<string>());
  const [allStepsVerified, setAllStepsVerified] = useState(false);
  const [hasRecordedParticipation, setHasRecordedParticipation] =
    useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, login } = usePrivy();
  const { wallets } = useWallets();
  const currentSlide = allSlides[slider.currentSlide];
  const isLastSlide = slider.isLast;

  // Load existing progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("course_progress")
          .select("completed_steps, verified_steps")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single();

        if (data && !error) {
          setCompletedSteps(new Set(data.completed_steps || []));
          setVerifiedSteps(new Set(data.verified_steps || []));
        }
      } catch (err) {
        console.log("No existing progress found, starting fresh");
      } finally {
        setIsInitialized(true);
      }
    };

    loadProgress();
  }, [user, courseId]);

  // Helper function to complete a step
  const completeStep = async (
    stepId: string,
    shouldVerify: boolean = false
  ) => {
    const newCompletedSteps = new Set([...completedSteps, stepId]);
    const newVerifiedSteps = shouldVerify
      ? new Set([...verifiedSteps, stepId])
      : verifiedSteps;

    setCompletedSteps(newCompletedSteps);
    if (shouldVerify) {
      setVerifiedSteps(newVerifiedSteps);
    }

    // Update progress in database
    if (user) {
      await updateCourseProgress(
        user.id,
        courseId,
        Array.from(newCompletedSteps),
        Array.from(newVerifiedSteps)
      );
    }

    if (onStepComplete) {
      onStepComplete(stepId);
    }
  };

  useEffect(() => {
    if (steps.length > 0 && verifiedSteps.size === steps.length) {
      setAllStepsVerified(true);
    }
  }, [verifiedSteps, steps.length]);

  // Mark current slide as completed when navigating to it
  useEffect(() => {
    const handleSlideView = async () => {
      // Wait for initialization to complete
      if (!isInitialized || !currentSlide || !user) return;

      // Mark slide as completed if not already completed
      if (!completedSlides.has(currentSlide.id)) {
        setCompletedSlides((prev) => new Set([...prev, currentSlide.id]));

        // If this is the last slide of a step that doesn't require action, complete the step
        if (currentSlide.isLastSlideInStep && !currentSlide.requiresAction) {
          await completeStep(currentSlide.stepId);
        }
      }

      // Record course participation when viewing first slide
      if (!hasRecordedParticipation) {
        try {
          await recordCourseParticipant(courseId, user.id);
          setHasRecordedParticipation(true);
        } catch (err) {
          console.error("Failed to record course participation", err);
        }
      }
    };

    handleSlideView();
  }, [
    currentSlide,
    completedSlides,
    user,
    hasRecordedParticipation,
    courseId,
    completedSteps,
    verifiedSteps,
    isInitialized,
  ]);

  const handleNext = async () => {
    // Just navigate to next slide - completion logic is handled in useEffect
    if (!isLastSlide) {
      slider.next();
    }
  };

  const handleComplete = async () => {
    // Handle completion of the entire course
    if (onAllStepsComplete) {
      onAllStepsComplete();
    }
  };

  const handleActionClick = async (
    slide: ExtendedSlide,
    action: string,
    url: string
  ) => {
    if (!user) {
      console.warn("Privy user not found");
      return;
    }

    try {
      // Record the user action
      const { error: insertError } = await supabase
        .from("user_actions")
        .insert([
          {
            user_id: user.id,
            action,
            target_url: url,
          },
        ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        return;
      }

      // Mark slide as completed
      setCompletedSlides((prev) => new Set([...prev, slide.id]));

      // If this slide requires action and is the last slide in step, mark step as complete and verified
      if (slide.requiresAction && slide.isLastSlideInStep) {
        await completeStep(slide.stepId, true); // true for verification
      }

      // Open URL in new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to record user action:", error);
    }
  };

  // const handleClaimRewards = async () => {
  //   if (!user || wallets.length === 0) {
  //     alert("Please connect your wallet!");
  //     return;
  //   }

  //   try {
  //     // 1. Get wallet provider and contract
  //     const wallet = wallets[0];
  //     await wallet.switchChain(4157); // CrossFi Mainnet Chain ID (confirm with CrossFi docs)
  //     const provider = await wallet.getEthereumProvider(); // Changed from getEthersProvider
  //     const contract = await getRewardContract(provider);

  //     // 2. Get total XP from Supabase
  //     const { data: course, error: courseError } = await supabase
  //       .from("courses")
  //       .select("reward_xp")
  //       .eq("id", courseId)
  //       .single();

  //     if (courseError || !course) {
  //       throw new Error("Course not found");
  //     }

  //     // 3. Get signature from Supabase
  //     const { data: signatureData, error: signatureError } = await supabase.functions.invoke('quick-handler', {
  //       body: {
  //         userAddress: wallet.address,
  //         courseId: parseInt(courseId),
  //         xpAmount: course.reward_xp,
  //       },
  //       headers: {
  //       Authorization: `Bearer ${user.id}`, // Use Privy user token
  //     },
  //     });

  //     if (signatureError || !signatureData) {
  //       throw new Error('Failed to get signature: ' + (signatureError?.message || 'Unknown error'));
  //     }

  //     const { signature } = signatureData;

  //     // 4. Call the smart contract
  //     const tx = await contract.claimReward(
  //       courseId,
  //       course.reward_xp,
  //       signature,
  //       { value: ethers.parseEther("0.0001") } // 0.0001 XFI fee
  //     );

  //     // 5. Wait for transaction
  //     await tx.wait();

  //     alert("Rewards claimed successfully!");
  //     //@ts-expect-error unknown
  //   } catch (error: Unknown) { // Changed from any to Error
  //     console.error("Claim failed:", error);
  //     alert("Failed to claim rewards: " + error.message);
  //   }
  // };

  // Test the user lookup
const testUserLookup = async () => {
  const userId = user?.id; // Your Privy user ID
  
  const { data, error } = await supabase.functions.invoke('test-user-lookup', {
    body: { userId }
  });
  
  console.log('Test results:', { data, error });
};

// Call this before trying to claim rewards
testUserLookup();
const handleClaimRewards = async () => {
  if (!user || wallets.length === 0) {
    alert("Please connect your wallet!");
    return;
  }

  try {
    // 1. Get wallet provider and contract
    const wallet = wallets[0];
    await wallet.switchChain(4157); // CrossFi Mainnet Chain ID
    const provider = await wallet.getEthereumProvider();
    const contract = await getRewardContract(provider);

    // 2. Get user ID from Supabase users table
    // Since you're using Privy, the user ID should be the Privy user ID (did:privy:...)
    const userId = user.id; // This should be the Privy user ID that matches your users table

    // Verify user exists in database (optional check)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, wallet")
      .eq("id", userId)
      .maybeSingle();

    if (!userData) {
      throw new Error("User not found in database. Please make sure you're signed in properly.");
    }

    // Verify wallet matches (optional security check)
    const currentWallet = wallet.address.toLowerCase();
    if (userData.wallet && userData.wallet.toLowerCase() !== currentWallet) {
      throw new Error("Wallet address mismatch. Please sign in with the correct wallet.");
    }

    // 3. Get signature from our edge function
    const { data: signatureResponse, error: signatureError } = await supabase.functions.invoke(
      'generate-reward-signature',
      {
        body: {
          courseId: parseInt(courseId),
          userId: userId,
        }
      }
    );

    if (signatureError || !signatureResponse?.success) {
      throw new Error('Failed to get signature: ' + (signatureResponse?.error || signatureError?.message || 'Unknown error'));
    }

    const { signature, xpAmount, walletAddress } = signatureResponse.data;

    // 4. Verify the wallet address matches
    if (walletAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      throw new Error("Wallet address mismatch");
    }

    // 5. Call the smart contract
    const tx = await contract.claimReward(
      parseInt(courseId),
      xpAmount,
      signature,
      { value: ethers.parseEther("0.0001") } // 0.0001 XFI fee
    );

    // 6. Wait for transaction confirmation
    const receipt = await tx.wait();

    // 7. Verify the claim on the backend
    const { data: verifyResponse, error: verifyError } = await supabase.functions.invoke(
      'verify-reward-claim',
      {
        body: {
          transactionHash: receipt.transactionHash,
          userId: userId,
          courseId: parseInt(courseId)
        }
      }
    );

    if (verifyError || !verifyResponse?.success) {
      console.error('Backend verification failed:', verifyError || verifyResponse?.error);
      // Don't throw here since the blockchain transaction succeeded
      // Just log the error for debugging
    }

    alert(`Rewards claimed successfully! You earned ${xpAmount} XP!`);
    
    // Optionally refresh the page or update local state
    // window.location.reload();
    
  } catch (error: any) {
    console.error("Claim failed:", error);
    
    // More specific error messages
    let errorMessage = "Failed to claim rewards";
    
    if (error.message?.includes("Course not completed")) {
      errorMessage = "You haven't completed this course yet!";
    } else if (error.message?.includes("already claimed")) {
      errorMessage = "You've already claimed rewards for this course!";
    } else if (error.message?.includes("Insufficient XFI fee")) {
      errorMessage = "Insufficient XFI balance to pay the claim fee.";
    } else if (error.message?.includes("Invalid proof")) {
      errorMessage = "Invalid reward proof. Please try again.";
    } else if (error.message) {
      errorMessage += ": " + error.message;
    }
    
    alert(errorMessage);
  }
};

// Helper function to get claimable rewards for the user
const getClaimableRewards = async () => {
  if (!user || wallets.length === 0) return [];

  try {
    const wallet = wallets[0];
    
    // Get user ID from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet", wallet.address.toLowerCase())
      .single();

    if (userError || !userData) {
      return [];
    }

    const { data: rewardsResponse, error: rewardsError } = await supabase.functions.invoke(
      'get-claimable-rewards',
      {
        body: { userId: userData.id }
      }
    );

    if (rewardsError || !rewardsResponse?.success) {
      console.error('Failed to get claimable rewards:', rewardsError);
      return [];
    }

    return rewardsResponse.data;
  } catch (error) {
    console.error('Error fetching claimable rewards:', error);
    return [];
  }
};

  const renderContent = (slide: ExtendedSlide) => {
    let content = slide.content.trim();

    // Remove "button:" prefix if present
    if (content.toLowerCase().startsWith("button:")) {
      content = content.slice(7).trim();
    }

    const buttonMatch = content.match(/^(.*?)\|(https?:\/\/[^\|]+)\|(.*)$/);

    if (buttonMatch) {
      const [, label, url, action] = buttonMatch;
      const isSlideCompleted = completedSlides.has(slide.id);
      const isStepCompleted = completedSteps.has(slide.stepId);

      return (
        <div className="text-center text-white space-y-2">
          <div className="text-xl flex justify-center items-center gap-2">
            <span>{label}</span>
            <Button
              onClick={() => handleActionClick(slide, action, url)}
              disabled={isSlideCompleted}
              className={`inline-flex items-center px-3 py-1 h-8 w-fit rounded transition text-sm cursor-pointer ${
                isSlideCompleted
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "text-white hover:bg-opacity-80"
              }`}
            >
              {isSlideCompleted ? "✅ Clicked" : "here"}
            </Button>
          </div>
          {isSlideCompleted && (
            <div className="text-green-400 text-sm font-medium">
              ✅ Action Completed
            </div>
          )}
          {isStepCompleted && (
            <div className="text-blue-400 text-sm font-medium">
              🎉 Step Verified!
            </div>
          )}
        </div>
      );
    }

    // Fallback for regular text
    return (
      <div className="text-2xl leading-relaxed text-center font-medium text-white">
        {content}
      </div>
    );
  };

  // Early return if no user
  if (!user) {
    return (
      <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
        <div className="text-center text-white min-h-[300px] flex items-center justify-center flex-col gap-3">
          <p>Please login to access this course.</p>
          <Button
            onClick={() => login()}
            className="w-fit px-10 cursor-pointer"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
        <div className="text-center text-white min-h-[300px] flex items-center justify-center">
          <p>Loading course progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
      {/* Progress indicator */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-white text-sm">
          Steps completed: {completedSteps.size}/{steps.length}
          {verifiedSteps.size > 0 && (
            <span className="text-green-400 ml-2">
              ({verifiedSteps.size} verified)
            </span>
          )}
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-2xl bg-new-bg mb-6 flex items-center justify-center w-full h-full">
        <div
          ref={slider.containerRef}
          className="flex transition-transform duration-300 ease-out"
        >
          {allSlides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 p-8 min-h-[300px] flex items-center justify-center"
              style={{ minWidth: "100%" }}
            >
              <div className="max-w-2xl mx-auto">
                {renderContent(slide)}
                {slide.requiresAction && slide.isLastSlideInStep && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="text-sm text-yellow-800">
                      ⚡ This step requires completing the action above to
                      finish
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={slider.prev}
          disabled={slider.isFirst}
          className="flex items-center space-x-2 px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => slider.moveToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === slider.currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {completedSteps.size === steps.length ? (
          <div className="mt-6 p-4 rounded-lg">
            <Button
              onClick={handleClaimRewards}
              className="w-full bg-green-600 hover:bg-green-700 px-3"
            >
              🎉 Claim Your XP Rewards!
            </Button>
          </div>
        ) : (
          <Button
            onClick={isLastSlide ? handleComplete : handleNext}
            className="w-fit px-8 cursor-pointer"
          >
            <span>{isLastSlide ? "Complete" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// const handleClaimRewards = async () => {
//   if (!user || wallets.length === 0) {
//     alert("Please connect your wallet!");
//     return;
//   }

//   try {
//     // 1. Get wallet provider and contract
//     const wallet = wallets[0];
//     await wallet.switchChain(4157); // CrossFi Mainnet Chain ID
//     const provider = await wallet.getEthereumProvider();
//     const contract = await getRewardContract(provider);

//     // 2. Get total XP from Supabase
//     const { data: course, error: courseError } = await supabase
//       .from("courses")
//       .select("reward_xp")
//       .eq("id", courseId)
//       .single();

//     if (courseError || !course) {
//       throw new Error("Course not found");
//     }

//     // 3. Get Supabase JWT for the Privy user
//     const { data: authData, error: authError } =
//       await supabase.functions.invoke("hyper-function", {
//         body: {
//           privyUserId: user.id,
//           walletAddress: wallet.address,
//         },
//       });

//     if (authError || !authData?.jwt) {
//       throw new Error(
//         "Failed to get JWT: " + (authError?.message || "Unknown error")
//       );
//     }

//     const jwt = authData.jwt;

//     console.log(jwt, "jwt");

//     // 4. Get signature from Supabase with JWT
//     const { data: signatureData, error: signatureError } =
//       await supabase.functions.invoke("swift-task", {
//         body: {
//           userAddress: wallet.address,
//           courseId: parseInt(courseId),
//           xpAmount: course.reward_xp,
//         },
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       });

//     if (signatureError || !signatureData) {
//       throw new Error(
//         "Failed to get signature: " +
//           (signatureError?.message || "Unknown error")
//       );
//     }

//     const { signature } = signatureData;
//     console.log(signature, "signature");

//     // 5. Call the smart contract
//     const tx = await contract.claimReward(
//       courseId,
//       course.reward_xp,
//       signature,
//       { value: ethers.parseEther("0.0001") }
//     );

//     // 6. Wait for transaction
//     await tx.wait();

//     alert("Rewards claimed successfully!");
//     //@ts-expect-error unknown
//   } catch (error: Unknown) {
//     console.error("Claim failed:", error);
//     alert("Failed to claim rewards: " + error.message);
//   }
// };
