
"use client";
import { Title } from "@/modules/app";
import CourseCard, { CourseCardSkeleton } from "@/modules/home/components/course-card";
import { useCoursesByCategory } from "@/modules/hooks/useCourseByCategory";
import { Course, Progress } from "@/modules/types";
import { useParams } from "next/navigation";


export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: courses,
    isLoading,
    error,
  } = useCoursesByCategory(slug);

  // Format slug for display if no courses (e.g., 'get-started' -> 'Get Started')
  const formatCategory = (category: string) =>
    category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="w-full flex flex-col gap-8 pb-16 min-h-screen">
      <Title title={courses?.[0]?.category || formatCategory(slug)} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      ) : !courses?.length ? (
        <p className="text-muted-foreground mt-4">No courses available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {courses.map(
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
      )}
    </div>
  );
}
