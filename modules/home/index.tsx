// "use client";
// import { BannerSlider } from "./components/banner";
// import CourseCard, { CourseCardSkeleton } from "./components/course-card";
// import { Title } from "../app/title";
// import { bannerSlides } from "../../data/data";
// import { Ecosystems } from "./components/ecosystems";
// import { Streaks } from "./components/streaks";
// import { Course, Progress } from "../types";
// import Link from "next/link";
// import { useCoursesGroupedByCategory } from "../hooks/useCoursesGroupedBySlug";
// import { slugify } from "@/utils";

// export function HomePage() {
//   const {
//     data: groupedCourses,
//     isLoading: isLoadingGrouped,
//     error: errorGrouped,
//   } = useCoursesGroupedByCategory();

//   console.log(groupedCourses, "groupedCourses");

//   return (
//     <div className="w-full flex flex-col gap-28 pb-16 min-h-screen">
//       {/* Hero Row */}
//       <div className="flex max-h-[400px] relative gap-7 items-stretch w-full">
//         <div className="flex-1">
//           <BannerSlider slides={bannerSlides} />
//         </div>
//       </div>

//       <Ecosystems />
//       <Streaks />

//       {isLoadingGrouped ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <CourseCardSkeleton key={index} />
//           ))}
//         </div>
//       ) : errorGrouped ? (
//         <p className="text-red-500">Error: {(errorGrouped as Error).message}</p>
//       ) : !groupedCourses || !Object.keys(groupedCourses).length ? (
//         <p className="text-muted-foreground mt-4">No courses available.</p>
//       ) : (
//         <div className="flex flex-col gap-8 mt-6">
//           {(() => {
//             // Get category keys
//             const categories = Object.keys(groupedCourses);
//             // Reorder: move second category (index 1) to first (index 0)
//             const reorderedCategories =
//               categories.length >= 2
//                 ? [
//                     categories[1],
//                     categories[0],
//                     ...categories.slice(2), // Keep remaining categories in order
//                   ]
//                 : categories;

//             // Render reordered categories
//             return reorderedCategories.map((category) => (
//               <div key={category} className="flex flex-col gap-8">
//                 <div className="flex justify-between items-center">
//                   <Title title={category} />
//                   <Link href={`/category/${slugify(category)}`} className="text-accent hover:underline">
//                     See All
//                   </Link>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
//                   {groupedCourses[category].slice(0, 3).map(
//                     (
//                       course: Course & {
//                         course_participants: { count: number }[];
//                         course_progress: Progress | null;
//                       }
//                     ) => (
//                       <CourseCard
//                         slug={course.slug}
//                         key={course.id}
//                         title={course.title}
//                         description={course.description}
//                         src={""}
//                         stats={course.course_participants?.[0]?.count || 0}
//                         progress={
//                           course.steps?.length &&
//                           course.course_progress?.completed_steps?.length
//                             ? course.course_progress.completed_steps.length /
//                               course.steps.length
//                             : null
//                         }
//                       />
//                     )
//                   )}
//                 </div>
//               </div>
//             ));
//           })()}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { BannerSlider } from "./components/banner";
import CourseCard, { CourseCardSkeleton } from "./components/course-card";
import { Title } from "../app/title";
import { bannerSlides } from "../../data/data";
import { Ecosystems } from "./components/ecosystems";
import { Streaks } from "./components/streaks";
import { Course, Progress } from "../types";
import Link from "next/link";
import { useCoursesGroupedByCategory } from "../hooks/useCoursesGroupedBySlug";

export function HomePage() {
  const {
    data: groupedCourses,
    isLoading: isLoadingGrouped,
    error: errorGrouped,
  } = useCoursesGroupedByCategory();

  return (
    <div className="w-full flex flex-col gap-28 pb-16 min-h-screen">
      <div className="flex max-h-[400px] relative gap-7 items-stretch w-full">
        <div className="flex-1">
          <BannerSlider slides={bannerSlides} />
        </div>
      </div>

      <Ecosystems />
      <Streaks />

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
                  <Title title={groupedCourses[category][0]?.category || category} />
                  <Link href={`/category/${category}`} className="text-accent hover:underline">
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
