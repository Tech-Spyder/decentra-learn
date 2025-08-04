"use client";

import React from "react";
import CourseCard, { CourseCardSkeleton } from "@/modules/home/components/course-card";
import { useCoursesGroupedByCategory } from "@/modules/hooks/useCoursesGroupedBySlug";
import { Title } from "@/modules/app";
import Link from "next/link";
import { Course, Progress } from "@/modules/types";

export default function Page() {
  const {
    data: groupedCourses,
    isLoading: isLoadingGrouped,
    error: errorGrouped,
  } = useCoursesGroupedByCategory();

  return (
    <div className="flex flex-col gap-8 px-6">
      <Title title="All Courses" className="underline"/>
      {isLoadingGrouped ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      ) : errorGrouped ? (
        <p className="text-red-500">Error: {(errorGrouped as Error).message}</p>
      ) : !groupedCourses || !Object.keys(groupedCourses).length ? (
        <p className="text-muted-foreground mt-4">No courses available.</p>
      ) : (
        <div className="flex flex-col gap-12 mt-6">
          {(() => {
            const categories = Object.keys(groupedCourses);
            const reorderedCategories =
              categories.length >= 2
                ? [categories[1], categories[0], ...categories.slice(2)]
                : categories;

            return reorderedCategories.map((category) => (
              <div key={category} className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <Title
                    title={groupedCourses[category][0]?.category || category}
                  />
                  <Link
                    href={`/category/${category}`}
                    className="text-accent hover:underline"
                  >
                    See All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  {groupedCourses[category].slice(0, 3).map(
                    (
                      course: Course & {
                        course_participants: { count: number }[];
                        course_progress: Progress | null;
                        category_slug: string;
                      }
                    ) => (
                      <CourseCard
                        slug={course.slug}
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        src={""}
                        stats={course.course_participants?.[0]?.count || 0}
                        progress={
                          course.steps?.length &&
                          course.course_progress?.completed_steps?.length
                            ? course.course_progress.completed_steps.length /
                              course.steps.length
                            : null
                        }
                      />
                    )
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
