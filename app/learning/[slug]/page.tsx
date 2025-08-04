"use client";

import { StepsSlider } from "@/modules/app/slider";
import { useCourse } from "@/modules/hooks/useSingleCourse";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { slug } = useParams();
  const { data, isLoading, error } = useCourse(slug as string);
  const { user } = usePrivy();

  if (isLoading) return <div className="p-6">Loading course...</div>;
  if (error)
    return <div className="p-6 text-red-500">Failed to load course</div>;
  if (!data?.steps || data.steps.length === 0)
    return <div className="p-6">No steps found for this course.</div>;
  const handleStepComplete = (stepId: string) => {
    console.log("Step completed:", stepId);
  };

  const handleAllStepsComplete = () => {
    console.log("All steps completed!");
    alert("Congratulations! All steps completed!");
  };
  return (
    <div className="max-w-5xl w-full mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-muted-foreground mb-8">{data.description}</p>

      {/* <CourseStepCarousel steps={data.steps} /> */}
      <StepsSlider
        steps={data.steps}
        onStepComplete={handleStepComplete}
        onAllStepsComplete={handleAllStepsComplete}
        courseId={data.id}
        userId={user?.id || ""}
      />
    </div>
  );
}
