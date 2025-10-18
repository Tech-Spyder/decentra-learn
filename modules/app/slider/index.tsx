"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step, Slider } from "@/modules/types";
import { Button } from "../button";
import { recordCourseParticipant } from "@/modules/functions";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "../hooks/useToast";
import { useClaimRewards } from "@/modules/hooks/useClaimRewards";


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
    const { data: existing, error: fetchError } = await supabase
      .from("course_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing progress:", fetchError);
      return null;
    }

    if (existing) {
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
}: {
  steps: Step[];
  courseId: string;
  userId: string;
  onStepComplete?: (stepId: string) => void;
  onAllStepsComplete?: () => void;
}) => {
  const toast = useToast();
  const { user, login } = usePrivy();
  const { isClaiming, claimRewards } = useClaimRewards();
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
  const [hasRecordedParticipation, setHasRecordedParticipation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const currentSlide = allSlides[slider.currentSlide];
  const isLastSlide = slider.isLast;

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const decodedUserId = decodeURIComponent(user.id);

        const { data, error } = await supabase
          .from("course_progress")
          .select("completed_steps, verified_steps")
          .eq("user_id", decodedUserId)
          .eq("course_id", courseId)
          .single();

        if (data && !error) {
          setCompletedSteps(new Set(data.completed_steps || []));
          setVerifiedSteps(new Set(data.verified_steps || []));

          // Mark all slides from completed steps as viewed
          const completedStepIds = new Set(data.completed_steps || []);
          const completedSlideIds = new Set<string>();
          
          allSlides.forEach((slide) => {
            if (completedStepIds.has(slide.stepId)) {
              completedSlideIds.add(slide.id);
            }
          });
          
          setCompletedSlides(completedSlideIds);

          const { data: allClaims, error: claimsError } = await supabase
            .from("reward_claims")
            .select("*")
            .eq("user_id", decodedUserId);

          if (allClaims && allClaims.length > 0) {
            const matchingClaim = allClaims.find(
              (claim) => claim.course_id === courseId
            );

            if (matchingClaim?.claimed === true) {
              setHasClaimedReward(true);
            } else {
              setHasClaimedReward(false);
            }
          } else {
            setHasClaimedReward(false);
          }

          const completedStepsSet = new Set(data.completed_steps || []);
          if (completedStepsSet.size === steps.length && allSlides.length > 0) {
            slider.moveToSlide(allSlides.length - 1);
          }
        }
      } catch (err) {
        console.log("No existing progress found, starting fresh");
      } finally {
        setIsInitialized(true);
      }
    };

    loadProgress();
  }, [user, courseId, steps.length, allSlides.length, slider]);

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

  useEffect(() => {
    const handleSlideView = async () => {
      if (!isInitialized || !currentSlide || !user) return;

      if (!completedSlides.has(currentSlide.id)) {
        setCompletedSlides((prev) => new Set([...prev, currentSlide.id]));

        if (currentSlide.isLastSlideInStep && !currentSlide.requiresAction) {
          await completeStep(currentSlide.stepId);
        }
      }

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
    isInitialized,
  ]);

  useEffect(() => {
    const markCourseComplete = async () => {
      if (completedSteps.size === steps.length && user) {
        const decodedUserId = decodeURIComponent(user.id);

        const { data: progress } = await supabase
          .from("course_progress")
          .select("completed")
          .eq("user_id", decodedUserId)
          .eq("course_id", courseId)
          .maybeSingle();

        if (!progress?.completed) {
          await supabase
            .from("course_progress")
            .update({
              completed: true,
              completed_at: new Date().toISOString(),
            })
            .eq("user_id", decodedUserId)
            .eq("course_id", courseId);

          toast.success("Course completed! Ready to claim rewards.", {
            duration: 3000,
          });
        }
      }
    };

    markCourseComplete();
  }, [completedSteps, steps.length, user, courseId, toast]);

  const handleNext = async () => {
    if (!isLastSlide) {
      slider.next();
    }
  };

  const handleComplete = async () => {
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

      setCompletedSlides((prev) => new Set([...prev, slide.id]));

      if (slide.requiresAction && slide.isLastSlideInStep) {
        await completeStep(slide.stepId, true);
      }

      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to record user action:", error);
    }
  };

  const handleClaimRewards = async () => {
    const success = await claimRewards(courseId);
    if (success) {
      setHasClaimedReward(true);
    }
  };

  const renderContent = (slide: ExtendedSlide) => {
    let content = slide.content.trim();

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

    return (
      <div className="text-2xl leading-relaxed text-center font-medium text-white">
        {content}
      </div>
    );
  };

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
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-white text-sm flex items-center justify-between">
          <div>
            Steps completed: {completedSteps.size}/{steps.length}
            {verifiedSteps.size > 0 && (
              <span className="text-green-400 ml-2">
                ({verifiedSteps.size} verified)
              </span>
            )}
          </div>
          {hasClaimedReward && (
            <div className="text-green-400 font-medium flex items-center gap-1">
              <span>✅</span>
              <span>Reward Claimed</span>
            </div>
          )}
        </div>
      </div>

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
              disabled={isClaiming || hasClaimedReward}
              className={`w-full px-3 cursor-pointer ${
                hasClaimedReward
                  ? "bg-gray-500 cursor-not-allowed"
                  : isClaiming
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {hasClaimedReward ? (
                <span className="flex items-center gap-2">
                  ✅ Reward Already Claimed
                </span>
              ) : isClaiming ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "🎉 Claim Your XP Rewards!"
              )}
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