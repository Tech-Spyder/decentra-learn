// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Step, Slider } from "@/modules/types";
// import { Button } from "../button";
// import { ethers } from "ethers";
// import { recordCourseParticipant } from "@/modules/functions";
// import { supabase } from "@/lib/superbaseClient";
// import { usePrivy } from "@privy-io/react-auth";

// // Extended slide type for internal use
// interface ExtendedSlide extends Slider {
//   stepId: string;
//   stepTitle: string;
//   stepNumber: number;
//   requiresAction: boolean;
//   isLastSlideInStep: boolean;
// }

// const useKeenSlider = (totalSlides: number) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const next = () => {
//     if (currentSlide < totalSlides - 1) {
//       setCurrentSlide((prev) => prev + 1);
//     }
//   };

//   const prev = () => {
//     if (currentSlide > 0) {
//       setCurrentSlide((prev) => prev - 1);
//     }
//   };

//   const moveToSlide = (index: number) => {
//     if (index >= 0 && index < totalSlides) {
//       setCurrentSlide(index);
//     }
//   };

//   useEffect(() => {
//     if (containerRef.current) {
//       const translateX = -currentSlide * 100;
//       containerRef.current.style.transform = `translateX(${translateX}%)`;
//     }
//   }, [currentSlide]);

//   return {
//     containerRef,
//     currentSlide,
//     totalSlides,
//     next,
//     prev,
//     moveToSlide,
//     isFirst: currentSlide === 0,
//     isLast: currentSlide === totalSlides - 1,
//   };
// };


// const updateCourseProgress = async (
//   userId: string,
//   courseId: string,
//   completedSteps: string[],
//   verifiedSteps: string[] = []
// ) => {
//   try {
//     // First, check if record exists
//     const { data: existing, error: fetchError } = await supabase
//       .from("course_progress")
//       .select("id")
//       .eq("user_id", userId)
//       .eq("course_id", courseId)
//       .single();

//     if (fetchError && fetchError.code !== "PGRST116") {
//       // PGRST116 is "not found" error, which is expected for new records
//       console.error("Error checking existing progress:", fetchError);
//       return null;
//     }

//     if (existing) {
//       // Update existing record
//       const { data, error } = await supabase
//         .from("course_progress")
//         .update({
//           completed_steps: completedSteps,
//           verified_steps: verifiedSteps,
//           last_updated: new Date().toISOString(),
//         })
//         .eq("user_id", userId)
//         .eq("course_id", courseId)
//         .select()
//         .single();

//       if (error) {
//         console.error("Error updating course progress:", error);
//         return null;
//       }
//       return data;
//     } else {
//       // Insert new record
//       const { data, error } = await supabase
//         .from("course_progress")
//         .insert({
//           user_id: userId,
//           course_id: courseId,
//           completed_steps: completedSteps,
//           verified_steps: verifiedSteps,
//           last_updated: new Date().toISOString(),
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error("Error inserting course progress:", error);
//         return null;
//       }
//       return data;
//     }
//   } catch (err) {
//     console.error("Unexpected error updating progress:", err);
//     return null;
//   }
// };

// export const StepsSlider = ({
//   steps,
//   onStepComplete,
//   onAllStepsComplete,
//   courseId,
//   userId,
// }: {
//   steps: Step[];
//   courseId: string;
//   userId: string;
//   onStepComplete?: (stepId: string) => void;
//   onAllStepsComplete?: () => void;
// }) => {
//   // Flatten all slides from all steps
//   const allSlides: ExtendedSlide[] = steps.reduce((acc, step) => {
//     const stepSlides = step.sliders
//       .sort((a, b) => a.order_index - b.order_index)
//       .map(
//         (slide): ExtendedSlide => ({
//           ...slide,
//           stepId: step.id,
//           stepTitle: step.title,
//           stepNumber: step.step_number,
//           requiresAction: step.requires_action,
//           isLastSlideInStep: slide.order_index === step.sliders.length - 1,
//         })
//       );
//     return [...acc, ...stepSlides];
//   }, [] as ExtendedSlide[]);

//   const slider = useKeenSlider(allSlides.length);
//   const [completedSlides, setCompletedSlides] = useState(new Set<string>());
//   const [completedSteps, setCompletedSteps] = useState(new Set<string>());
//   const [verifiedSteps, setVerifiedSteps] = useState(new Set<string>());
//   const [allStepsVerified, setAllStepsVerified] = useState(false);
//   const [hasRecordedParticipation, setHasRecordedParticipation] =
//     useState(false);
//   const { user, login } = usePrivy();
//   const currentSlide = allSlides[slider.currentSlide];
//   const isLastSlide = slider.isLast;
// console.log(allStepsVerified);

//   // Load existing progress on mount
//   useEffect(() => {
//     const loadProgress = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from("course_progress")
//           .select("completed_steps, verified_steps")
//           .eq("user_id", user.id)
//           .eq("course_id", courseId)
//           .single();

//         if (data && !error) {
//           setCompletedSteps(new Set(data.completed_steps || []));
//           setVerifiedSteps(new Set(data.verified_steps || []));
//         }
//       } catch (err) {
//         console.log("No existing progress found, starting fresh");
//       }
//     };

//     loadProgress();
//   }, [user, courseId]);
//   useEffect(() => {
//     if (steps.length > 0 && verifiedSteps.size === steps.length) {
//       setAllStepsVerified(true);
//     }
//   }, [verifiedSteps, steps.length]);
//   const handleNext = async () => {
//     // Record course participation
//     if (!hasRecordedParticipation && user) {
//       try {
//         await recordCourseParticipant(courseId, user.id);
//         setHasRecordedParticipation(true);
//       } catch (err) {
//         console.error("Failed to record course participation", err);
//       }
//     }

//     if (currentSlide) {
//       setCompletedSlides((prev) => new Set([...prev, currentSlide.id]));

//       // Check if this completes a step (and if step doesn't require action)
//       if (currentSlide.isLastSlideInStep) {
//         if (!currentSlide.requiresAction) {
//           // Auto-complete steps that don't require action
//           const newCompletedSteps = new Set([
//             ...completedSteps,
//             currentSlide.stepId,
//           ]);
//           setCompletedSteps(newCompletedSteps);

//           // Update progress in database
//           if (user) {
//             await updateCourseProgress(
//               user.id,
//               courseId,
//               Array.from(newCompletedSteps),
//               Array.from(verifiedSteps)
//             );
//           }

//           if (onStepComplete) {
//             onStepComplete(currentSlide.stepId);
//           }
//         }
//         // If requires action, we'll mark it complete when the action is performed
//       }

//       if (isLastSlide && onAllStepsComplete) {
//         onAllStepsComplete();
//       }
//     }

//     slider.next();
//   };

//   const handleActionClick = async (
//     slide: ExtendedSlide,
//     action: string,
//     url: string
//   ) => {
//     if (!user) {
//       console.warn("Privy user not found");
//       return;
//     }

//     try {
//       // Record the user action
//       const { error: insertError } = await supabase
//         .from("user_actions")
//         .insert([
//           {
//             user_id: user.id,
//             action,
//             target_url: url,
//           },
//         ]);

//       if (insertError) {
//         console.error("Insert error:", insertError);
//         return;
//       }

//       // Mark slide as completed
//       setCompletedSlides((prev) => new Set([...prev, slide.id]));

//       // If this slide requires action and is the last slide in step, mark step as complete
//       if (slide.requiresAction && slide.isLastSlideInStep) {
//         const newCompletedSteps = new Set([...completedSteps, slide.stepId]);
//         const newVerifiedSteps = new Set([...verifiedSteps, slide.stepId]);

//         setCompletedSteps(newCompletedSteps);
//         setVerifiedSteps(newVerifiedSteps);

//         // Update progress in database
//         await updateCourseProgress(
//           user.id,
//           courseId,
//           Array.from(newCompletedSteps),
//           Array.from(newVerifiedSteps)
//         );

//         if (onStepComplete) {
//           onStepComplete(slide.stepId);
//         }
//       }

//       // Open URL in new tab
//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Failed to record user action:", error);
//     }
//   };

//   const handleClaimRewards = async () => {
//     if (!user) return;

//     try {
//       // 1. Get total XP from backend
//       const { data: course } = await supabase
//         .from("courses")
//         .select("reward_xp")
//         .eq("id", courseId)
//         .single();

//       if (!course) throw new Error("Course not found");

//       // 2. Call your smart contract
//       const tx = await rewardContract.claimReward(
//         courseId,
//         course.reward_xp,
//         { value: ethers.utils.parseEther("0.0001") } // XFI fee
//       );

//       // 3. Wait for transaction
//       await tx.wait();

//       alert("Rewards claimed successfully!");
//     } catch (error) {
//       console.error("Claim failed:", error);
//       alert("Failed to claim rewards");
//     }
//   };
//   const renderContent = (slide: ExtendedSlide) => {
//     let content = slide.content.trim();

//     // Remove "button:" prefix if present
//     if (content.toLowerCase().startsWith("button:")) {
//       content = content.slice(7).trim();
//     }

//     const buttonMatch = content.match(/^(.*?)\|(https?:\/\/[^\|]+)\|(.*)$/);

//     if (buttonMatch) {
//       const [, label, url, action] = buttonMatch;
//       const isSlideCompleted = completedSlides.has(slide.id);
//       const isStepCompleted = completedSteps.has(slide.stepId);

//       return (
//         <div className="text-center text-white space-y-2">
//           <div className="text-xl flex justify-center items-center gap-2">
//             <span>{label}</span>
//             <Button
//               onClick={() => handleActionClick(slide, action, url)}
//               disabled={isSlideCompleted}
//               className={`inline-flex items-center px-3 py-1 h-8 w-fit rounded transition text-sm cursor-pointer ${
//                 isSlideCompleted
//                   ? "bg-green-600 text-white cursor-not-allowed"
//                   : "text-white hover:bg-opacity-80"
//               }`}
//             >
//               {isSlideCompleted ? "✅ Clicked" : "here"}
//             </Button>
//           </div>
//           {isSlideCompleted && (
//             <div className="text-green-400 text-sm font-medium">
//               ✅ Action Completed
//             </div>
//           )}
//           {isStepCompleted && (
//             <div className="text-blue-400 text-sm font-medium">
//               🎉 Step Verified!
//             </div>
//           )}
//         </div>
//       );
//     }

//     // Fallback for regular text
//     return (
//       <div className="text-2xl leading-relaxed text-center font-medium text-white">
//         {content}
//       </div>
//     );
//   };

//   // Early return if no user
//   if (!user) {
//     return (
//       <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
//         <div className="text-center text-white min-h-[300px] flex items-center justify-center flex-col gap-3">
//           <p>Please login to access this course.</p>
//           <Button
//             onClick={() => login()}
//             className="w-fit px-10 cursor-pointer"
//           >
//             Login
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
//       {/* Progress indicator */}
//       <div className="mb-4 p-3 bg-gray-800 rounded-lg">
//         <div className="text-white text-sm">
//           Steps completed: {completedSteps.size}/{steps.length}
//           {verifiedSteps.size > 0 && (
//             <span className="text-green-400 ml-2">
//               ({verifiedSteps.size} verified)
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Slider Container */}
//       <div className="relative overflow-hidden rounded-2xl bg-new-bg mb-6 flex items-center justify-center w-full h-full">
//         <div
//           ref={slider.containerRef}
//           className="flex transition-transform duration-300 ease-out"
//         >
//           {allSlides.map((slide) => (
//             <div
//               key={slide.id}
//               className="w-full flex-shrink-0 p-8 min-h-[300px] flex items-center justify-center"
//               style={{ minWidth: "100%" }}
//             >
//               <div className="max-w-2xl mx-auto">
//                 {renderContent(slide)}
//                 {slide.requiresAction && slide.isLastSlideInStep && (
//                   <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//                     <div className="text-sm text-yellow-800">
//                       ⚡ This step requires completing the action above to
//                       finish
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation Controls */}
//       <div className="flex justify-between items-center">
//         <button
//           onClick={slider.prev}
//           disabled={slider.isFirst}
//           className="flex items-center space-x-2 px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           <span>Previous</span>
//         </button>

//         <div className="flex space-x-2">
//           {allSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => slider.moveToSlide(index)}
//               className={`w-2 h-2 rounded-full transition-colors ${
//                 index === slider.currentSlide ? "bg-blue-600" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>

//         {allStepsVerified ? (
//           <div className="mt-6 p-4 bg-green-800 rounded-lg">
//             <Button
//               // onClick={handleClaimRewards}
//               className="w-full bg-green-600 hover:bg-green-700"
//             >
//               🎉 Claim Your XP Rewards!
//             </Button>
//           </div>
//         ) : (
//           <Button
//             onClick={handleNext}
//             disabled={slider.isLast}
//             className="w-fit px-8 cursor-pointer"
//           >
//             <span>{slider.isLast ? "Complete" : "Next"}</span>
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Step, Slider } from "@/modules/types";
// import { Button } from "../button";
// import { ethers } from "ethers";
// import { recordCourseParticipant } from "@/modules/functions";
// import { supabase } from "@/lib/superbaseClient";
// import { usePrivy } from "@privy-io/react-auth";

// // Extended slide type for internal use
// interface ExtendedSlide extends Slider {
//   stepId: string;
//   stepTitle: string;
//   stepNumber: number;
//   requiresAction: boolean;
//   isLastSlideInStep: boolean;
// }

// const useKeenSlider = (totalSlides: number) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const next = () => {
//     if (currentSlide < totalSlides - 1) {
//       setCurrentSlide((prev) => prev + 1);
//     }
//   };

//   const prev = () => {
//     if (currentSlide > 0) {
//       setCurrentSlide((prev) => prev - 1);
//     }
//   };

//   const moveToSlide = (index: number) => {
//     if (index >= 0 && index < totalSlides) {
//       setCurrentSlide(index);
//     }
//   };

//   useEffect(() => {
//     if (containerRef.current) {
//       const translateX = -currentSlide * 100;
//       containerRef.current.style.transform = `translateX(${translateX}%)`;
//     }
//   }, [currentSlide]);

//   return {
//     containerRef,
//     currentSlide,
//     totalSlides,
//     next,
//     prev,
//     moveToSlide,
//     isFirst: currentSlide === 0,
//     isLast: currentSlide === totalSlides - 1,
//   };
// };


// const updateCourseProgress = async (
//   userId: string,
//   courseId: string,
//   completedSteps: string[],
//   verifiedSteps: string[] = []
// ) => {
//   try {
//     // First, check if record exists
//     const { data: existing, error: fetchError } = await supabase
//       .from("course_progress")
//       .select("id")
//       .eq("user_id", userId)
//       .eq("course_id", courseId)
//       .single();

//     if (fetchError && fetchError.code !== "PGRST116") {
//       // PGRST116 is "not found" error, which is expected for new records
//       console.error("Error checking existing progress:", fetchError);
//       return null;
//     }

//     if (existing) {
//       // Update existing record
//       const { data, error } = await supabase
//         .from("course_progress")
//         .update({
//           completed_steps: completedSteps,
//           verified_steps: verifiedSteps,
//           last_updated: new Date().toISOString(),
//         })
//         .eq("user_id", userId)
//         .eq("course_id", courseId)
//         .select()
//         .single();

//       if (error) {
//         console.error("Error updating course progress:", error);
//         return null;
//       }
//       return data;
//     } else {
//       // Insert new record
//       const { data, error } = await supabase
//         .from("course_progress")
//         .insert({
//           user_id: userId,
//           course_id: courseId,
//           completed_steps: completedSteps,
//           verified_steps: verifiedSteps,
//           last_updated: new Date().toISOString(),
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error("Error inserting course progress:", error);
//         return null;
//       }
//       return data;
//     }
//   } catch (err) {
//     console.error("Unexpected error updating progress:", err);
//     return null;
//   }
// };

// export const StepsSlider = ({
//   steps,
//   onStepComplete,
//   onAllStepsComplete,
//   courseId,
//   userId,
// }: {
//   steps: Step[];
//   courseId: string;
//   userId: string;
//   onStepComplete?: (stepId: string) => void;
//   onAllStepsComplete?: () => void;
// }) => {
//   // Flatten all slides from all steps
//   const allSlides: ExtendedSlide[] = steps.reduce((acc, step) => {
//     const stepSlides = step.sliders
//       .sort((a, b) => a.order_index - b.order_index)
//       .map(
//         (slide): ExtendedSlide => ({
//           ...slide,
//           stepId: step.id,
//           stepTitle: step.title,
//           stepNumber: step.step_number,
//           requiresAction: step.requires_action,
//           isLastSlideInStep: slide.order_index === step.sliders.length - 1,
//         })
//       );
//     return [...acc, ...stepSlides];
//   }, [] as ExtendedSlide[]);

//   const slider = useKeenSlider(allSlides.length);
//   const [completedSlides, setCompletedSlides] = useState(new Set<string>());
//   const [completedSteps, setCompletedSteps] = useState(new Set<string>());
//   const [verifiedSteps, setVerifiedSteps] = useState(new Set<string>());
//   const [allStepsVerified, setAllStepsVerified] = useState(false);
//   const [hasRecordedParticipation, setHasRecordedParticipation] =
//     useState(false);
//   const { user, login } = usePrivy();
//   const currentSlide = allSlides[slider.currentSlide];
//   const isLastSlide = slider.isLast;
// console.log(allStepsVerified);

//   // Load existing progress on mount
//   useEffect(() => {
//     const loadProgress = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from("course_progress")
//           .select("completed_steps, verified_steps")
//           .eq("user_id", user.id)
//           .eq("course_id", courseId)
//           .single();

//         if (data && !error) {
//           setCompletedSteps(new Set(data.completed_steps || []));
//           setVerifiedSteps(new Set(data.verified_steps || []));
//         }
//       } catch (err) {
//         console.log("No existing progress found, starting fresh");
//       }
//     };

//     loadProgress();
//   }, [user, courseId]);
  
//   // Helper function to complete a step
//   const completeStep = async (stepId: string, shouldVerify: boolean = false) => {
//     const newCompletedSteps = new Set([...completedSteps, stepId]);
//     const newVerifiedSteps = shouldVerify 
//       ? new Set([...verifiedSteps, stepId])
//       : verifiedSteps;

//     setCompletedSteps(newCompletedSteps);
//     if (shouldVerify) {
//       setVerifiedSteps(newVerifiedSteps);
//     }

//     // Update progress in database
//     if (user) {
//       await updateCourseProgress(
//         user.id,
//         courseId,
//         Array.from(newCompletedSteps),
//         Array.from(newVerifiedSteps)
//       );
//     }

//     if (onStepComplete) {
//       onStepComplete(stepId);
//     }
//   };

//   useEffect(() => {
//     if (steps.length > 0 && verifiedSteps.size === steps.length) {
//       setAllStepsVerified(true);
//     }
//   }, [verifiedSteps, steps.length]);

//   // Mark current slide as completed when navigating to it
//   useEffect(() => {
//     const handleSlideView = async () => {
//       if (currentSlide && !completedSlides.has(currentSlide.id)) {
//         setCompletedSlides((prev) => new Set([...prev, currentSlide.id]));
        
//         // If this is the last slide of a step that doesn't require action, complete the step
//         if (currentSlide.isLastSlideInStep && !currentSlide.requiresAction) {
//           await completeStep(currentSlide.stepId);
//         }

//         // Record course participation when viewing first slide
//         if (!hasRecordedParticipation && user) {
//           try {
//             await recordCourseParticipant(courseId, user.id);
//             setHasRecordedParticipation(true);
//           } catch (err) {
//             console.error("Failed to record course participation", err);
//           }
//         }
//       }
//     };

//     handleSlideView();
//   }, [currentSlide, completedSlides, user, hasRecordedParticipation, courseId, completedSteps, verifiedSteps]);

//   const handleNext = async () => {
//     // Just navigate to next slide - completion logic is handled in useEffect
//     if (!isLastSlide) {
//       slider.next();
//     }
//   };

//   const handleComplete = async () => {
//     // Handle completion of the entire course
//     if (onAllStepsComplete) {
//       onAllStepsComplete();
//     }
//   };

//   const handleActionClick = async (
//     slide: ExtendedSlide,
//     action: string,
//     url: string
//   ) => {
//     if (!user) {
//       console.warn("Privy user not found");
//       return;
//     }

//     try {
//       // Record the user action
//       const { error: insertError } = await supabase
//         .from("user_actions")
//         .insert([
//           {
//             user_id: user.id,
//             action,
//             target_url: url,
//           },
//         ]);

//       if (insertError) {
//         console.error("Insert error:", insertError);
//         return;
//       }

//       // Mark slide as completed
//       setCompletedSlides((prev) => new Set([...prev, slide.id]));

//       // If this slide requires action and is the last slide in step, mark step as complete and verified
//       if (slide.requiresAction && slide.isLastSlideInStep) {
//         await completeStep(slide.stepId, true); // true for verification
//       }

//       // Open URL in new tab
//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Failed to record user action:", error);
//     }
//   };

//   const handleClaimRewards = async () => {
//     if (!user) return;

//     try {
//       // 1. Get total XP from backend
//       const { data: course } = await supabase
//         .from("courses")
//         .select("reward_xp")
//         .eq("id", courseId)
//         .single();

//       if (!course) throw new Error("Course not found");

//       // 2. Call your smart contract
//       const tx = await rewardContract.claimReward(
//         courseId,
//         course.reward_xp,
//         { value: ethers.utils.parseEther("0.0001") } // XFI fee
//       );

//       // 3. Wait for transaction
//       await tx.wait();

//       alert("Rewards claimed successfully!");
//     } catch (error) {
//       console.error("Claim failed:", error);
//       alert("Failed to claim rewards");
//     }
//   };
  
//   const renderContent = (slide: ExtendedSlide) => {
//     let content = slide.content.trim();

//     // Remove "button:" prefix if present
//     if (content.toLowerCase().startsWith("button:")) {
//       content = content.slice(7).trim();
//     }

//     const buttonMatch = content.match(/^(.*?)\|(https?:\/\/[^\|]+)\|(.*)$/);

//     if (buttonMatch) {
//       const [, label, url, action] = buttonMatch;
//       const isSlideCompleted = completedSlides.has(slide.id);
//       const isStepCompleted = completedSteps.has(slide.stepId);

//       return (
//         <div className="text-center text-white space-y-2">
//           <div className="text-xl flex justify-center items-center gap-2">
//             <span>{label}</span>
//             <Button
//               onClick={() => handleActionClick(slide, action, url)}
//               disabled={isSlideCompleted}
//               className={`inline-flex items-center px-3 py-1 h-8 w-fit rounded transition text-sm cursor-pointer ${
//                 isSlideCompleted
//                   ? "bg-green-600 text-white cursor-not-allowed"
//                   : "text-white hover:bg-opacity-80"
//               }`}
//             >
//               {isSlideCompleted ? "✅ Clicked" : "here"}
//             </Button>
//           </div>
//           {isSlideCompleted && (
//             <div className="text-green-400 text-sm font-medium">
//               ✅ Action Completed
//             </div>
//           )}
//           {isStepCompleted && (
//             <div className="text-blue-400 text-sm font-medium">
//               🎉 Step Verified!
//             </div>
//           )}
//         </div>
//       );
//     }

//     // Fallback for regular text
//     return (
//       <div className="text-2xl leading-relaxed text-center font-medium text-white">
//         {content}
//       </div>
//     );
//   };

//   // Early return if no user
//   if (!user) {
//     return (
//       <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
//         <div className="text-center text-white min-h-[300px] flex items-center justify-center flex-col gap-3">
//           <p>Please login to access this course.</p>
//           <Button
//             onClick={() => login()}
//             className="w-fit px-10 cursor-pointer"
//           >
//             Login
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-new-tertiary p-6 rounded-[20px] shadow-lg border border-border">
//       {/* Progress indicator */}
//       <div className="mb-4 p-3 bg-gray-800 rounded-lg">
//         <div className="text-white text-sm">
//           Steps completed: {completedSteps.size}/{steps.length}
//           {verifiedSteps.size > 0 && (
//             <span className="text-green-400 ml-2">
//               ({verifiedSteps.size} verified)
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Slider Container */}
//       <div className="relative overflow-hidden rounded-2xl bg-new-bg mb-6 flex items-center justify-center w-full h-full">
//         <div
//           ref={slider.containerRef}
//           className="flex transition-transform duration-300 ease-out"
//         >
//           {allSlides.map((slide) => (
//             <div
//               key={slide.id}
//               className="w-full flex-shrink-0 p-8 min-h-[300px] flex items-center justify-center"
//               style={{ minWidth: "100%" }}
//             >
//               <div className="max-w-2xl mx-auto">
//                 {renderContent(slide)}
//                 {slide.requiresAction && slide.isLastSlideInStep && (
//                   <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//                     <div className="text-sm text-yellow-800">
//                       ⚡ This step requires completing the action above to
//                       finish
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation Controls */}
//       <div className="flex justify-between items-center">
//         <button
//           onClick={slider.prev}
//           disabled={slider.isFirst}
//           className="flex items-center space-x-2 px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           <span>Previous</span>
//         </button>

//         <div className="flex space-x-2">
//           {allSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => slider.moveToSlide(index)}
//               className={`w-2 h-2 rounded-full transition-colors ${
//                 index === slider.currentSlide ? "bg-blue-600" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>

//         {completedSteps.size === steps.length ? (
//           <div className="mt-6 p-4 rounded-lg">
//             <Button
//               // onClick={handleClaimRewards}
//               className="w-full bg-green-600 hover:bg-green-700 px-3"
//             >
//               🎉 Claim Your XP Rewards!
//             </Button>
//           </div>
//         ) : (
//           <Button
//             onClick={isLastSlide ? handleComplete : handleNext}
//             className="w-fit px-8 cursor-pointer"
//           >
//             <span>{isLastSlide ? "Complete" : "Next"}</span>
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

'use client';

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
      }
    };

    loadProgress();
  }, [user, courseId]);

  // Helper function to complete a step
  const completeStep = async (stepId: string, shouldVerify: boolean = false) => {
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
      if (currentSlide && !completedSlides.has(currentSlide.id)) {
        setCompletedSlides((prev) => new Set([...prev, currentSlide.id]));

        // If this is the last slide of a step that doesn't require action, complete the step
        if (currentSlide.isLastSlideInStep && !currentSlide.requiresAction) {
          await completeStep(currentSlide.stepId);
        }

        // Record course participation when viewing first slide
        if (!hasRecordedParticipation && user) {
          try {
            await recordCourseParticipant(courseId, user.id);
            setHasRecordedParticipation(true);
          } catch (err) {
            console.error("Failed to record course participation", err);
          }
        }
      }
    };

    handleSlideView();
  }, [currentSlide, completedSlides, user, hasRecordedParticipation, courseId, completedSteps, verifiedSteps]);

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

  const handleClaimRewards = async () => {
    if (!user || wallets.length === 0) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      // 1. Get wallet provider and contract
      const wallet = wallets[0];
      await wallet.switchChain(4157); // CrossFi Mainnet Chain ID (confirm with CrossFi docs)
      const provider = await wallet.getEthereumProvider(); // Changed from getEthersProvider
      const contract = await getRewardContract(provider);

      // 2. Get total XP from Supabase
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("reward_xp")
        .eq("id", courseId)
        .single();

      if (courseError || !course) {
        throw new Error("Course not found");
      }

      // 3. Get signature from Supabase
      const { data: signatureData, error: signatureError } = await supabase.functions.invoke('generate-signature', {
        body: {
          userAddress: wallet.address,
          courseId: parseInt(courseId),
          xpAmount: course.reward_xp,
        },
      });

      if (signatureError || !signatureData) {
        throw new Error('Failed to get signature: ' + (signatureError?.message || 'Unknown error'));
      }

      const { signature } = signatureData;

      // 4. Call the smart contract
      const tx = await contract.claimReward(
        courseId,
        course.reward_xp,
        signature,
        { value: ethers.parseEther("0.0001") } // 0.0001 XFI fee
      );

      // 5. Wait for transaction
      await tx.wait();

      alert("Rewards claimed successfully!");
      //@ts-expect-error unknown
    } catch (error: Unknown) { // Changed from any to Error
      console.error("Claim failed:", error);
      alert("Failed to claim rewards: " + error.message);
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
