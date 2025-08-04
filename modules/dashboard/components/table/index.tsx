import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Users,
  Award,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Save,
  X,
} from "lucide-react";
import { Title } from "@/modules/app";

// Type definitions
interface Course {
  id: number;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "in progress" | "Completed";
  participants: number;
  rewards: string;
  icon: string;
}

type SortField = keyof Course | "";
type SortDirection = "asc" | "desc";
type FilterStatus = "all" | "in progress" | "completed";
type FilterLevel = "all" | "beginner" | "intermediate" | "advanced";

interface NewCourseForm {
  title: string;
  level: Course["level"];
  status: Course["status"];
  participants: number;
  rewards: string;
  icon: string;
}

const ActivityTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "The Fastest On Chain Experience",
      level: "Beginner",
      status: "in progress",
      participants: Math.floor(Math.random() * 5000) + 8000,
      rewards: "10,234 MPX",
      icon: "🚀",
    },
    {
      id: 2,
      title: "The Fastest On Chain Experience",
      level: "Beginner",
      status: "Completed",
      participants: Math.floor(Math.random() * 5000) + 8000,
      rewards: "10,234 MPX",
      icon: "🚀",
    },
    {
      id: 3,
      title: "The Fastest On Chain Experience",
      level: "Beginner",
      status: "in progress",
      participants: Math.floor(Math.random() * 5000) + 8000,
      rewards: "10,234 MPX",
      icon: "🚀",
    },
    {
      id: 4,
      title: "Advanced DeFi Strategies",
      level: "Advanced",
      status: "Completed",
      participants: Math.floor(Math.random() * 3000) + 2000,
      rewards: "25,500 MPX",
      icon: "📈",
    },
    {
      id: 5,
      title: "NFT Creation Masterclass",
      level: "Intermediate",
      status: "in progress",
      participants: Math.floor(Math.random() * 4000) + 5000,
      rewards: "15,750 MPX",
      icon: "🎨",
    },
  ]);

  const [sortField, setSortField] = useState<SortField>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState<NewCourseForm>({
    title: "",
    level: "Beginner",
    status: "in progress",
    participants: 1000,
    rewards: "5,000 MPX",
    icon: "📚",
  });

  // Simulate real-time updates for participant counts
  useEffect(() => {
    const interval = setInterval(() => {
      setCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          participants:
            course.status === "in progress"
              ? Math.max(
                  1,
                  course.participants + Math.floor(Math.random() * 21) - 10
                ) // +/- 10 participants
              : course.participants,
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate API fetch function
  const fetchCourses = async (): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate fetching fresh data (in real app, this would be an actual API call)
    const freshData = courses.map((course) => ({
      ...course,
      participants: Math.floor(Math.random() * 5000) + 1000,
    }));

    setCourses(freshData);
  };

  const handleSort = (field: SortField): void => {
    const direction: SortDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-400";
      case "in progress":
        return "text-yellow-400";
      default:
        return "";
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-new-tertiary";
    }
  };

  const handleEdit = (course: Course): void => {
    setEditingId(course.id);
    setEditForm({ ...course });
  };

  const handleSave = (): void => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === editingId
          ? ({ ...course, ...editForm } as Course)
          : course
      )
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: number): void => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== id)
    );
  };

  const handleAddCourse = (): void => {
    if (newCourse.title.trim()) {
      const id = Math.max(...courses.map((c) => c.id)) + 1;
      const courseToAdd: Course = {
        ...newCourse,
        id,
        participants: parseInt(newCourse.participants.toString()),
      };
      setCourses((prevCourses) => [...prevCourses, courseToAdd]);
      setNewCourse({
        title: "",
        level: "Beginner",
        status: "in progress",
        participants: 1000,
        rewards: "5,000 MPX",
        icon: "📚",
      });
      setShowAddForm(false);
    }
  };

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatusFilter =
        filterStatus === "all" || course.status.toLowerCase() === filterStatus;
      const matchesLevelFilter =
        filterLevel === "all" || course.level.toLowerCase() === filterLevel;
      return matchesSearch && matchesStatusFilter && matchesLevelFilter;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === "participants") {
        aValue =
          typeof aValue === "number"
            ? aValue
            : parseInt(aValue.toString().replace(/[^0-9]/g, ""));
        bValue =
          typeof bValue === "number"
            ? bValue
            : parseInt(bValue.toString().replace(/[^0-9]/g, ""));
      } else if (sortField === "rewards") {
        aValue = parseInt((aValue as string).replace(/[^0-9]/g, ""));
        bValue = parseInt((bValue as string).replace(/[^0-9]/g, ""));
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div>
      <div className="p-4 flex items-center justify-between w-full">
        <Title title="Activity"/>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 " />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 " />
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterStatus(e.target.value as FilterStatus)
                }
                className="bg-secondary border border-border rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* <select
              value={filterLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterLevel(e.target.value as FilterLevel)
              }
              className="bg-gray-700 border border-new-tertiary rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select> */}
          </div>

          {/* <div className="flex gap-2">
            <button
              onClick={fetchCourses}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div> */}
        </div>

        {/* Add Course Form */}
        {/* {showAddForm && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Course title"
                value={newCourse.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="bg-new-tertiary border border-border rounded px-3 py-2 text-white text-sm"
              />
              <select
                value={newCourse.level}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewCourse({
                    ...newCourse,
                    level: e.target.value as Course["level"],
                  })
                }
                className="bg-new-tertiary border border-border rounded px-3 py-2 text-white text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={newCourse.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewCourse({
                    ...newCourse,
                    status: e.target.value as Course["status"],
                  })
                }
                className="bg-new-tertiary border border-border rounded px-3 py-2 text-white text-sm"
              >
                <option value="in progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddCourse}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Add Course
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-new-tertiary hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </div>
      <div className="bg-[#171717] rounded-3xl overflow-hidden border border-border">
        {/* Search and Filter Controls */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#171717]">
              <tr className="border-b border-border">
                <th
                  className="text-left p-4  font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-2">
                    Course
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        sortField === "title" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th
                  className="text-left p-4  font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        sortField === "status" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th
                  className="text-left p-4  font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("participants")}
                >
                  <div className="flex items-center gap-2">
                    Participants
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        sortField === "participants" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th
                  className="text-left p-4  font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("rewards")}
                >
                  <div className="flex items-center gap-2">
                    Rewards
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        sortField === "rewards" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-border bg-secondary hover:bg-gray-750 transition-colors"
                >
                  <td className="p-4">
                    {editingId === course.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={editForm.icon || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditForm({ ...editForm, icon: e.target.value })
                          }
                          className="w-10 h-10 bg-new-tertiary border border-border rounded text-center text-lg"
                          maxLength={2}
                        />
                        <div>
                          <input
                            type="text"
                            value={editForm.title || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-new-tertiary border border-border rounded px-2 py-1 text-white text-sm mb-1 w-full"
                          />
                          <select
                            value={editForm.level || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              setEditForm({
                                ...editForm,
                                level: e.target.value as Course["level"],
                              })
                            }
                            className="bg-new-tertiary border border-border rounded px-2 py-1 text-white text-xs"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
                          {course.icon}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {course.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium text-white ${getLevelColor(
                                course.level
                              )}`}
                            >
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === course.id ? (
                      <select
                        value={editForm.status || ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditForm({
                            ...editForm,
                            status: e.target.value as Course["status"],
                          })
                        }
                        className="bg-new-tertiary border border-border rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="in progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`font-medium ${getStatusColor(
                          course.status
                        )}`}
                      >
                        {course.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      {typeof course.participants === "number"
                        ? `${(course.participants / 1000).toFixed(1)}k+`
                        : course.participants}
                    </div>
                  </td>
                  <td className="p-4">
                    {editingId === course.id ? (
                      <input
                        type="text"
                        value={editForm.rewards || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditForm({ ...editForm, rewards: e.target.value })
                        }
                        className="bg-new-tertiary border border-border rounded px-2 py-1 text-white text-sm w-24"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-blue-400 font-medium">
                        <Award className="w-4 h-4" />
                        {course.rewards}
                      </div>
                    )}
                  </td>
                  {/* <td className="p-4">
                  {editingId === course.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSave}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1  hover:text-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedCourses.length === 0 && (
          <div className="p-8 text-center ">
            <div className="text-4xl mb-4">📚</div>
            <div className="text-lg font-medium mb-2">No courses found</div>
            <div className="text-sm">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTable;
