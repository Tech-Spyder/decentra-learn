import { Tabs, TabsContent, TabsList, TabsTrigger } from "../app";
import { courseContent } from "../data/data";
import CourseCard from "./components/course-card";

export function HomePage() {
  const courses = ["Web 3", "Tokens", "Wallets", "Lending", "Borrowing", "Stake"];

  return (
    <div className="w-full flex flex-col gap-8 min-h-screen pb-16">
      <div className="flex flex-col gap-4">
        <h4>All Courses</h4>
        <Tabs defaultValue={courses[0]} className="w-full">
          <TabsList>
            {courses.map((course) => (
              <TabsTrigger key={course} value={course}>
                {course}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course} value={course}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {courseContent
                  .filter((c) => c.category === course)
                  .map((c) => (
                    <CourseCard
                      key={c.title}
                      title={c.title}
                      description={c.description}
                      src={c.src}
                      stats={c.stats}
                      progress={c.progress}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

