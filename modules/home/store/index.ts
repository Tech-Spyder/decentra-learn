// modules/home/store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Course {
  id: string;
  category: string;
  title: string;
  description?: string;
  src: string;
  stats: number;
  progress?: number;
}

interface CourseState {
  selectedCourse?: Course;
  setSelectedCourse: (course?: Course) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      selectedCourse: undefined,
      setSelectedCourse: (course) => set({ selectedCourse: course }),
    }),
    {
      name: "selected-course-v1",
      storage: createJSONStorage(() => localStorage),
      // partialize? leave default (stores everything)
    }
  )
);
