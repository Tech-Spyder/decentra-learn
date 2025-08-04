export const PLAYLISTS = {
  beginner: "PLpi4MPUpO0NAzVZCJ6qgw8XtmoXBSTgCD",
  intermediate: "PLpi4MPUpO0NCrm_-QiLgczQKmddWSjrDs",
  advanced: "PLpi4MPUpO0NAOk7_0uUdJ6DV_EucaswZw",
};

export type Slider = {
  id: string;
type: "text" | "image";
  content: string;
  order_index: number;
};

export type Step = {
  id: string;
  title: string;
  step_number: number;
  requires_action: boolean;
  sliders: Slider[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  reward_xp: number;
  steps: Step[];
  created_at: string;
  category: string;
  category_slug: string; // Optional for category slug
};

export type Progress = {
  id: string;
  user_id: string;
  course_id: string;
  completed_steps: number[]; // adjust to match your schema
  earned_xp: number;
};

export type UseCourseWithProgressResult = {
  course: Course;
  progress: Progress | null;
};
