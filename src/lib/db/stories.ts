import { createClient } from "@/lib/supabase/client";

export interface SuccessStory {
  name: string;
  school: string;
  quote: string;
  avatar: string;
}

const mockStories: SuccessStory[] = [
  { name: "Alex T.", school: "Harvard", quote: "My consultant helped me craft a compelling narrative that stood out.", avatar: "👨🏿" },
  { name: "Sarah M.", school: "Stanford", quote: "The mock interview sessions were incredibly helpful!", avatar: "👩🏻" },
  { name: "James K.", school: "MIT", quote: "Got into MIT thanks to the resume guidance.", avatar: "👨🏻" },
];

export async function getSuccessStories(): Promise<SuccessStory[]> {
  const supabase = createClient();
  if (!supabase) return mockStories;

  const { data, error } = await supabase
    .from("success_stories")
    .select("name, school, quote, avatar")
    .order("created_at", { ascending: true });

  if (error || !data?.length) return mockStories;
  return data;
}
