import { createClient } from "@/lib/supabase/client";
import { consultants as mockConsultants, type Consultant } from "@/data/consultants";

interface DbConsultant {
  id: string;
  name: string;
  avatar: string;
  school: string;
  major: string;
  gpa: string;
  min_gpa: number;
  bio: string;
  specialties: string[];
  services: { duration: number; price: number }[];
  rating: number;
  review_count: number;
  reviews: { id: string; author: string; rating: number; date: string; content: string }[];
  available_slots: { date: string; times: string[] }[];
  student_success: string[];
  year: string;
}

function mapToConsultant(row: DbConsultant): Consultant {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    school: row.school,
    major: row.major,
    gpa: row.gpa,
    minGPA: row.min_gpa,
    bio: row.bio,
    specialties: row.specialties,
    services: row.services,
    rating: row.rating,
    reviewCount: row.review_count,
    reviews: row.reviews,
    availableSlots: row.available_slots,
    studentSuccess: row.student_success,
    year: row.year,
  };
}

export async function getConsultants(): Promise<Consultant[]> {
  const supabase = createClient();
  if (!supabase) return mockConsultants;

  const { data, error } = await supabase
    .from("consultants")
    .select("*")
    .order("rating", { ascending: false });

  if (error || !data?.length) return mockConsultants;
  return data.map(mapToConsultant);
}

export async function getConsultantById(id: string): Promise<Consultant | undefined> {
  const supabase = createClient();
  if (!supabase) return mockConsultants.find((c) => c.id === id);

  const { data, error } = await supabase
    .from("consultants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return mockConsultants.find((c) => c.id === id);
  return mapToConsultant(data);
}
