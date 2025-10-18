import React, { useState } from "react";
import { ChevronDown, Award, Loader } from "lucide-react";
import { Title } from "@/modules/app";
import { useToast } from "@/modules/app/hooks/useToast";
import { CourseProgress, useUserCourses } from "@/modules/hooks/useCourseWithProgress";
import { useClaimRewards } from "@/modules/hooks/useClaimRewards";
import { useUserStats } from "@/modules/hooks/useUserStats";

type SortField = "title" | "status" | "reward";
type SortDirection = "asc" | "desc";

export default function UserCoursesTable() {
  const { data: courses = [], isLoading, error, refetch } = useUserCourses();
  const { claimRewards, isClaiming } = useClaimRewards();
  const {refetch: StatsRefetch} = useUserStats();
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const getStatus = (
    course: CourseProgress
  ): "completed" | "in progress" => {
    const completed = course.completed_steps?.length || 0;
    const total = course.steps_count || 0;
    return completed >= total ? "completed" : "in progress";
  };

  const getProgressPercent = (course: CourseProgress): number => {
    const completed = course.completed_steps?.length || 0;
    const total = course.steps_count || 1;
    return Math.round((completed / total) * 100);
  };

  const getStatusColor = (status: string): string => {
    return status === "completed" ? "text-green-400" : "text-yellow-400";
  };

  const handleSort = (field: SortField) => {
    const direction: SortDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const handleClaimReward = async (courseId: string) => {
    setClaimingId(courseId);
    const success = await claimRewards(courseId);
    if (success) {
      refetch()
      StatsRefetch()
    }
    setClaimingId(null);
  };

  const filteredAndSortedCourses = courses
    .filter((course) =>
      course.courses?.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "title":
          aVal = a.courses?.title || "";
          bVal = b.courses?.title || "";
          break;
        case "status":
          aVal = getStatus(a);
          bVal = getStatus(b);
          break;
        case "reward":
          aVal = a.courses?.reward_xp || 0;
          bVal = b.courses?.reward_xp || 0;
          break;
      }

      return sortDirection === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 font-medium">Error loading courses</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <Title title="My Courses" />
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-white w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#171717] rounded-3xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#171717]">
              <tr className="border-b border-border">
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-2">
                    Course
                    <ChevronDown
                      className={`w-4 h-4 ${
                        sortField === "title" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ChevronDown
                      className={`w-4 h-4 ${
                        sortField === "status" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th className="text-left p-4 font-medium">Progress</th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white"
                  onClick={() => handleSort("reward")}
                >
                  <div className="flex items-center gap-2">
                    Reward
                    <ChevronDown
                      className={`w-4 h-4 ${
                        sortField === "reward" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th className="text-left p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCourses.map((course) => {
                const status = getStatus(course);
                const progressPercent = getProgressPercent(course);
                const isCompleted = status === "completed";
                const isClaimed = course.earned_xp > 0;

                return (
                  <tr
                    key={course.id}
                    className="border-b border-border bg-secondary hover:bg-gray-750"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">
                          {course.courses?.title}
                        </div>
                        {course.courses?.description && (
                          <div className="text-sm text-gray-400 mt-1">
                            {course.courses.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-medium capitalize ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#4A4A4A] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300 w-12">
                          {progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-blue-400 font-medium">
                        <Award className="w-4 h-4" />
                        {course.courses?.reward_xp || 0} XP
                      </div>
                    </td>
                    <td className="p-4">
                      {isCompleted && !isClaimed ? (
                        <button
                          onClick={() => handleClaimReward(course.course_id)}
                          disabled={claimingId === course.course_id || isClaiming}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                        >
                          {claimingId === course.course_id && isClaiming ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            "Claim Reward"
                          )}
                        </button>
                      ) : isClaimed ? (
                        <span className="text-green-400 font-medium text-sm">
                          ✅ Claimed
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {progressPercent}% Complete
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedCourses.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <div className="text-lg font-medium mb-2">No courses found</div>
            <div className="text-sm text-gray-400">
              {courses.length === 0
                ? "Start a course to see your progress"
                : "No courses match your search"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}