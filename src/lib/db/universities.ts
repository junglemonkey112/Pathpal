import { createClient } from "@/lib/supabase/client";
import {
  universities as mockUniversities,
  type University,
} from "@/data/universities";

// Map Supabase university ranking to website tier
function rankingToTier(ranking: number | null): number {
  if (!ranking || ranking <= 10) return 1;
  if (ranking <= 30) return 2;
  if (ranking <= 60) return 3;
  return 4;
}

// Map strong_majors_en to label categories
const majorToLabel: Record<string, string> = {
  "computer science": "stem",
  engineering: "stem",
  mathematics: "stem",
  physics: "stem",
  chemistry: "stem",
  biology: "health",
  "data science": "stem",
  "electrical engineering": "stem",
  "mechanical engineering": "stem",
  business: "business",
  economics: "business",
  finance: "business",
  marketing: "business",
  accounting: "business",
  management: "business",
  "political science": "social",
  psychology: "social",
  sociology: "social",
  "international relations": "social",
  "public policy": "social",
  "public health": "health",
  medicine: "health",
  nursing: "health",
  neuroscience: "health",
  "pre-med": "health",
  art: "arts",
  design: "arts",
  music: "arts",
  film: "arts",
  theater: "arts",
  "visual arts": "arts",
  "fine arts": "arts",
  architecture: "arts",
  history: "humanities",
  philosophy: "humanities",
  literature: "humanities",
  english: "humanities",
  "comparative literature": "humanities",
  classics: "humanities",
  law: "social",
};

function majorsToLabels(majors: string[] | null): string[] {
  if (!majors) return [];
  const labels = new Set<string>();
  for (const major of majors) {
    const lower = major.toLowerCase();
    for (const [keyword, label] of Object.entries(majorToLabel)) {
      if (lower.includes(keyword)) {
        labels.add(label);
        break;
      }
    }
  }
  return Array.from(labels);
}

export interface SupabaseUniversity {
  id: string;
  name_en: string;
  name_cn: string;
  ranking: number | null;
  school_type_en: string | null;
  acceptance_rate: string | null;
  acceptance_rate_num: number | null;
  avg_gpa: number | null;
  avg_sat: number | null;
  min_toefl: number | null;
  tuition: string | null;
  tuition_in_state: string | null;
  students: number | null;
  intl_ratio: string | null;
  location_en: string | null;
  strong_majors_en: string[] | null;
  tags_en: string[] | null;
  highlights_en: string[] | null;
  description_en: string | null;
}

function mapToUniversity(row: SupabaseUniversity): University {
  return {
    name: row.name_en,
    tier: rankingToTier(row.ranking),
    labels: majorsToLabels(row.strong_majors_en),
  };
}

export async function getUniversities(): Promise<University[]> {
  const supabase = createClient();
  if (!supabase) return mockUniversities;

  const { data, error } = await supabase
    .from("universities")
    .select("id, name_en, name_cn, ranking, school_type_en, acceptance_rate, acceptance_rate_num, avg_gpa, avg_sat, min_toefl, tuition, tuition_in_state, students, intl_ratio, location_en, strong_majors_en, tags_en, highlights_en, description_en")
    .order("ranking", { ascending: true });

  if (error || !data?.length) return mockUniversities;
  return data.map(mapToUniversity);
}

export async function getUniversitiesRich(): Promise<SupabaseUniversity[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("universities")
    .select("id, name_en, name_cn, ranking, school_type_en, acceptance_rate, acceptance_rate_num, avg_gpa, avg_sat, min_toefl, tuition, tuition_in_state, students, intl_ratio, location_en, strong_majors_en, tags_en, highlights_en, description_en")
    .order("ranking", { ascending: true });

  if (error || !data?.length) return [];
  return data;
}
