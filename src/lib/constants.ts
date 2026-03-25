// AI Chat
export const MAX_FREE_QUESTIONS = 3;
export const AI_RESPONSE_DELAY_MS = 500;

// Onboarding
export const MAX_SCHOOL_SELECTIONS = 5;

// Grade levels
export const GRADE_LEVELS = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] as const;

// Budget options for quick finder
export const BUDGET_OPTIONS = [
  { label: "< $30", value: 30 },
  { label: "$30-50", value: 50 },
  { label: "$50-80", value: 80 },
  { label: "$80-100", value: 100 },
  { label: "$100+", value: 150 },
] as const;

// Interest options
export const INTERESTS = [
  { id: "stem", label: "STEM", icon: "🔬" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "arts", label: "Arts", icon: "🎨" },
  { id: "social", label: "Social Sciences", icon: "🌍" },
  { id: "health", label: "Health/Pre-Med", icon: "🏥" },
  { id: "humanities", label: "Humanities", icon: "📚" },
] as const;

// Interest to recommended majors mapping
export const INTEREST_TO_MAJORS: Record<string, string[]> = {
  stem: ["Computer Science", "Electrical Engineering", "Data Science", "Mathematics"],
  business: ["Business Analytics", "Economics", "Finance", "Marketing"],
  arts: ["Visual Arts", "Film & Media", "Music", "Design"],
  social: ["International Relations", "Political Science", "Sociology", "Psychology"],
  health: ["Biology", "Neuroscience", "Pre-Medicine", "Public Health"],
  humanities: ["Literature", "History", "Philosophy", "Comparative Literature"],
};

// Sort options
export type SortOption = "rating" | "price-asc" | "price-desc";
