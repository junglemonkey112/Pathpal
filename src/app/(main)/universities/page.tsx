"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Search, ArrowLeft } from "lucide-react";
import { getUniversitiesRich, type SupabaseUniversity } from "@/lib/db/universities";
import UniversityCard from "@/components/UniversityCard";
import { SkeletonUniversityCard } from "@/components/Skeleton";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<SupabaseUniversity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState<"ranking" | "acceptance" | "tuition">("ranking");

  useEffect(() => {
    getUniversitiesRich()
      .then(setUniversities)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = universities
    .filter((u) => {
      const matchesSearch =
        u.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.location_en ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.strong_majors_en ?? []).some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = !selectedType || u.school_type_en === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "ranking") return (a.ranking ?? 999) - (b.ranking ?? 999);
      if (sortBy === "acceptance") return (a.acceptance_rate_num ?? 1) - (b.acceptance_rate_num ?? 1);
      if (sortBy === "tuition") {
        const parseT = (t: string | null) => parseInt((t ?? "$0").replace(/[^0-9]/g, "")) || 0;
        return parseT(a.tuition) - parseT(b.tuition);
      }
      return 0;
    });

  const schoolTypes = [...new Set(universities.map((u) => u.school_type_en).filter(Boolean))] as string[];

  return (
    <div className="min-h-screen bg-page-bg font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">PathPal</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-text-secondary hover:text-text-primary font-medium">Consultants</Link>
              <Link href="/universities" className="text-accent-dark font-semibold">Universities</Link>
              <Link href="/forum" className="text-text-secondary hover:text-text-primary font-medium">Community</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">US Universities</h1>
          <p className="text-text-secondary mt-1">{universities.length} universities with detailed admission data</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by name, location, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              {schoolTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ranking">Ranking</option>
              <option value="acceptance">Acceptance Rate</option>
              <option value="tuition">Tuition (Low → High)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonUniversityCard key={i} />)
            : filtered.map((u) => <UniversityCard key={u.id} university={u} />)
          }
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-tertiary text-lg">No universities found</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedType(""); }}
              className="mt-4 text-accent-dark hover:text-accent font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
