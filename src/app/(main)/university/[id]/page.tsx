"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, MapPin, Users, Globe, BookOpen, Trophy, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseUniversity } from "@/lib/db/universities";

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [university, setUniversity] = useState<SupabaseUniversity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    supabase
      .from("universities")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setUniversity(data);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="animate-pulse text-text-tertiary">Loading...</div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-tertiary mb-4">University not found</p>
          <Link href="/universities" className="text-accent-dark hover:text-accent">
            ← Browse universities
          </Link>
        </div>
      </div>
    );
  }

  const u = university;

  return (
    <div className="min-h-screen bg-page-bg font-sans">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/universities" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> All Universities
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{u.name_en}</h1>
              {u.name_cn && <p className="text-white/70 mt-1">{u.name_cn}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/80">
                {u.location_en && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {u.location_en}
                  </span>
                )}
                {u.school_type_en && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> {u.school_type_en}
                  </span>
                )}
              </div>
            </div>
            {u.ranking && (
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex flex-col items-center justify-center">
                <span className="text-white text-xs">Rank</span>
                <span className="text-white text-xl font-bold">#{u.ranking}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {u.acceptance_rate && (
            <StatCard icon={<Trophy className="w-5 h-5 text-accent" />} label="Acceptance Rate" value={u.acceptance_rate} />
          )}
          {u.avg_gpa && (
            <StatCard icon={<BookOpen className="w-5 h-5 text-accent" />} label="Avg GPA" value={u.avg_gpa.toFixed(2)} />
          )}
          {u.avg_sat && (
            <StatCard icon={<Sparkles className="w-5 h-5 text-accent" />} label="Avg SAT" value={u.avg_sat.toString()} />
          )}
          {u.tuition && (
            <StatCard icon={<GraduationCap className="w-5 h-5 text-accent" />} label="Tuition" value={u.tuition} />
          )}
          {u.students && (
            <StatCard icon={<Users className="w-5 h-5 text-accent" />} label="Students" value={u.students.toLocaleString()} />
          )}
          {u.intl_ratio && (
            <StatCard icon={<Globe className="w-5 h-5 text-accent" />} label="International" value={u.intl_ratio} />
          )}
          {u.min_toefl && (
            <StatCard icon={<BookOpen className="w-5 h-5 text-accent" />} label="Min TOEFL" value={u.min_toefl.toString()} />
          )}
          {u.tuition_in_state && (
            <StatCard icon={<GraduationCap className="w-5 h-5 text-accent" />} label="In-State Tuition" value={u.tuition_in_state} />
          )}
        </div>

        {/* Description */}
        {u.description_en && (
          <section className="bg-card-bg rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">About</h2>
            <p className="text-text-secondary leading-relaxed">{u.description_en}</p>
          </section>
        )}

        {/* Strong Majors */}
        {u.strong_majors_en && u.strong_majors_en.length > 0 && (
          <section className="bg-card-bg rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Strong Majors</h2>
            <div className="flex flex-wrap gap-2">
              {u.strong_majors_en.map((major) => (
                <span key={major} className="px-3 py-1.5 bg-accent-bg text-accent-dark rounded-full text-sm font-medium">
                  {major}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Highlights */}
        {u.highlights_en && u.highlights_en.length > 0 && (
          <section className="bg-card-bg rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Highlights</h2>
            <ul className="space-y-2">
              {u.highlights_en.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tags */}
        {u.tags_en && u.tags_en.length > 0 && (
          <section className="bg-card-bg rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {u.tags_en.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-border-light text-text-secondary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Interested in {u.name_en}?</h2>
          <p className="text-white/70 mb-4">Find a consultant who can help you get admitted</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-accent to-accent-dark text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Find a Consultant
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-text-tertiary text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-text-primary">{value}</p>
    </div>
  );
}
