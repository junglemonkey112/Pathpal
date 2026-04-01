/**
 * Seed script: inserts mock consultants into Supabase.
 * Usage: npx tsx scripts/seed-consultants.ts
 */
import { createClient } from "@supabase/supabase-js";
import { consultants } from "../src/data/consultants";

const SUPABASE_URL = "https://tepoydlsqmqdfptjshqo.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcG95ZGxzcW1xZGZwdGpzaHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY1NzUsImV4cCI6MjA5MDAzMjU3NX0.AhtWkjBD-fXdCHBCYhdH7eSnjWGS25jDTC7RyvK4X34";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Transform to DB schema (camelCase -> snake_case)
const rows = consultants.map((c) => ({
  id: c.id,
  name: c.name,
  avatar: c.avatar,
  school: c.school,
  major: c.major,
  gpa: c.gpa,
  min_gpa: c.minGPA,
  bio: c.bio,
  specialties: c.specialties,
  services: c.services,
  rating: c.rating,
  review_count: c.reviewCount,
  reviews: c.reviews,
  available_slots: c.availableSlots,
  student_success: c.studentSuccess,
  year: c.year,
}));

async function main() {
  console.log(`Found ${rows.length} consultants to seed`);

  const BATCH_SIZE = 25;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("consultants").upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${inserted}/${rows.length})`);
    }
  }

  console.log(`Done! Seeded ${inserted} consultants.`);
}

main().catch(console.error);
