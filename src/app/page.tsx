"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { Search, GraduationCap, ChevronRight, Sparkles, FileText, Calendar, Video, SlidersHorizontal, X, Menu, LogOut, User } from "lucide-react";
import { consultants as mockConsultants, Consultant } from "@/data/consultants";
import { clsx } from "clsx";
import AIChat from "@/components/AIChat";
import ConsultantCard from "@/components/ConsultantCard";
import ForumPreview from "@/components/ForumPreview";
import { samplePosts, Post } from "@/data/forum";
import { getRecommendedSchools, getRecommendedMajors } from "@/data/universities";
import { INTERESTS, GRADE_LEVELS } from "@/lib/constants";
import type { SortOption } from "@/lib/constants";
import { useUser } from "@/context/UserContext";
import { getConsultants } from "@/lib/db/consultants";
import { getForumPosts } from "@/lib/db/forum";
import { getSuccessStories, type SuccessStory } from "@/lib/db/stories";
import { getUniversitiesRich, type SupabaseUniversity } from "@/lib/db/universities";
import { SkeletonConsultantCard } from "@/components/Skeleton";
import UniversityCard from "@/components/UniversityCard";

interface MatchedConsultant {
  consultant: Consultant;
  score: number;
  reasons: string[];
}

export default function Home() {
  const { user, signOut, isLoading: authLoading } = useUser();

  // Quick finder state
  const [grade, setGrade] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(100);
  const [budgetUnlimited, setBudgetUnlimited] = useState(false);
  const [currentSchool, setCurrentSchool] = useState("");
  const [gpa, setGpa] = useState("");

  // Deep match state
  const [showDeepMatch, setShowDeepMatch] = useState(false);
  const [targetMajor, setTargetMajor] = useState("");
  const [targetSchools, setTargetSchools] = useState<string[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showAllConsultants, setShowAllConsultants] = useState(false);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data state (loaded from Supabase with fallback to mock)
  const [allConsultants, setAllConsultants] = useState<Consultant[]>(mockConsultants);
  const [forumPosts, setForumPosts] = useState<Post[]>(samplePosts);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([
    { name: "Alex T.", school: "Harvard", quote: "My consultant helped me craft a compelling narrative that stood out.", avatar: "👨🏿" },
    { name: "Sarah M.", school: "Stanford", quote: "The mock interview sessions were incredibly helpful!", avatar: "👩🏻" },
    { name: "James K.", school: "MIT", quote: "Got into MIT thanks to the resume guidance.", avatar: "👨🏻" },
  ]);

  // Universities state
  const [universities, setUniversities] = useState<SupabaseUniversity[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    Promise.all([
      getConsultants().then(setAllConsultants).catch(() => {}),
      getForumPosts().then(setForumPosts).catch(() => {}),
      getSuccessStories().then(setSuccessStories).catch(() => {}),
      getUniversitiesRich().then(setUniversities).catch(() => {}),
    ]).finally(() => setIsLoading(false));
  }, []);

  // Toggle interest
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Simple matching logic
  const getMatchedConsultants = (): MatchedConsultant[] => {
    return allConsultants.map(c => {
      let score = 0;
      const reasons: string[] = [];

      // Budget filter (using 60-min session price)
      if (!budgetUnlimited && c.services[1].price > budget) {
        return null;
      }

      // GPA filter
      if (gpa && parseFloat(gpa) < c.minGPA) {
        return null;
      }

      // Interest match
      const interestMatch = c.specialties.filter(s =>
        selectedInterests.some(i =>
          (i === "stem" && (s.includes("CS") || s.includes("Engineering") || s.includes("STEM") || s.includes("Math") || s.includes("Science"))) ||
          (i === "business" && (s.includes("Business") || s.includes("Economics"))) ||
          (i === "arts" && (s.includes("Arts") || s.includes("Creative") || s.includes("Film") || s.includes("Design"))) ||
          (i === "social" && (s.includes("Social") || s.includes("Policy") || s.includes("International"))) ||
          (i === "health" && (s.includes("Pre-Med") || s.includes("Medical") || s.includes("Biology") || s.includes("Neuroscience"))) ||
          (i === "humanities" && (s.includes("Literature") || s.includes("History") || s.includes("Humanities") || s.includes("Philosophy")))
        )
      );

      if (interestMatch.length > 0) {
        score += interestMatch.length * 20;
        reasons.push(interestMatch[0]);
      }

      // Deep match: target major
      if (showDeepMatch && targetMajor) {
        if (c.major.toLowerCase().includes(targetMajor.toLowerCase()) ||
            c.specialties.some(s => s.toLowerCase().includes(targetMajor.toLowerCase()))) {
          score += 30;
          reasons.push("Matches target major");
        }
      }

      // Deep match: target schools
      if (showDeepMatch && targetSchools.length > 0) {
        const schoolMatch = targetSchools.some(s =>
          c.studentSuccess.some(ss => ss.toLowerCase().includes(s.toLowerCase()))
        );
        if (schoolMatch) {
          score += 25;
          reasons.push("Experience with target school");
        }
      }

      // Current school boost (same school alumni)
      if (currentSchool && c.school.toLowerCase().includes(currentSchool.toLowerCase())) {
        score += 15;
        reasons.push("Same school alumni");
      }

      return { consultant: c, score, reasons: reasons.slice(0, 2) };
    }).filter((item): item is MatchedConsultant => item !== null)
      .sort((a, b) => b.score - a.score);
  };

  const matchedConsultants = getMatchedConsultants();

  const displayedConsultants: (MatchedConsultant | Consultant)[] = showAllConsultants
    ? allConsultants
    : matchedConsultants.slice(0, 5);

  const getConsultantData = (item: MatchedConsultant | Consultant) => {
    if ("consultant" in item) {
      return { consultant: item.consultant, score: item.score, reasons: item.reasons };
    }
    return { consultant: item, score: 0, reasons: [] as string[] };
  };

  const filteredConsultants = displayedConsultants
    .filter((c) => {
      const { consultant } = getConsultantData(c);
      const matchesSearch =
        consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSchool = !selectedSchool || consultant.school === selectedSchool;
      return matchesSearch && matchesSchool;
    })
    .sort((a, b) => {
      const dataA = getConsultantData(a);
      const dataB = getConsultantData(b);

      if (!showAllConsultants && sortBy === "rating") {
        return dataB.score - dataA.score;
      }
      if (sortBy === "rating") return dataB.consultant.rating - dataA.consultant.rating;
      if (sortBy === "price-asc") return dataA.consultant.services[0].price - dataB.consultant.services[0].price;
      if (sortBy === "price-desc") return dataB.consultant.services[0].price - dataA.consultant.services[0].price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-page-bg font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">PathPal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setShowAllConsultants(true)} className="text-text-secondary hover:text-text-primary font-medium">All Consultants</button>
              <Link href="/universities" className="text-text-secondary hover:text-text-primary font-medium">Universities</Link>
              <Link href="/forum" className="text-text-secondary hover:text-text-primary font-medium">Community</Link>
              <a href="#how-it-works" className="text-text-secondary hover:text-text-primary font-medium">How It Works</a>
              <a href="#success-stories" className="text-text-secondary hover:text-text-primary font-medium">Success Stories</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/become-consultant" className="text-text-secondary hover:text-text-primary font-medium text-sm">
                    Become a Consultant
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-border-light rounded-lg">
                    <User className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-secondary max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-text-tertiary hover:text-text-secondary p-2 rounded-lg hover:bg-border-light transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/become-consultant" className="text-text-secondary hover:text-text-primary font-medium text-sm">
                    Become a Consultant
                  </Link>
                  <Link href="/login" className="text-text-secondary hover:text-text-primary font-medium text-sm">
                    Sign In
                  </Link>
                  <Link href="/signup" className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card-bg px-4 py-4 space-y-3">
            <button
              onClick={() => { setShowAllConsultants(true); setMobileMenuOpen(false); }}
              className="block w-full text-left text-text-secondary hover:text-text-primary font-medium py-2"
            >
              All Consultants
            </button>
            <Link href="/universities" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">Universities</Link>
            <Link href="/forum" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">Community</Link>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">How It Works</a>
            <a href="#success-stories" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">Success Stories</a>
            <Link href="/become-consultant" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">
              Become a Consultant
            </Link>
            {user ? (
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="block w-full text-left text-text-secondary hover:text-text-primary font-medium py-2"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-text-secondary hover:text-text-primary font-medium py-2">Sign In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-sm text-center">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Quick Finder Hero */}
      <section className="bg-primary text-white py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Find Your Perfect <span className="text-accent-light">College Consultant</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Answer a few questions to get matched with top college students
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 space-y-5">
            {/* Grade + Interests */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Grade Level *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" className="text-text-primary">Select your grade</option>
                  {GRADE_LEVELS.map(g => <option key={g} value={g} className="text-text-primary">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Interests *</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                        selectedInterests.includes(item.id)
                          ? "bg-accent text-text-primary"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget per session within
                {budgetUnlimited ? <span className="text-accent-light ml-2">(No limit)</span> : <span className="ml-2">${budget}</span>}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={budgetUnlimited ? 150 : budget}
                  onChange={(e) => {
                    setBudgetUnlimited(false);
                    setBudget(parseInt(e.target.value));
                  }}
                  disabled={budgetUnlimited}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setBudgetUnlimited(!budgetUnlimited)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                    budgetUnlimited ? "bg-accent text-text-primary" : "bg-white/10 text-slate-400 hover:text-white"
                  )}
                >
                  Any
                </button>
              </div>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GPA <span className="text-slate-500">(Optional - helps filter target schools)</span>
              </label>
              <select
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" className="text-text-primary">Select GPA</option>
                <option value="3.0" className="text-text-primary">Below 3.5</option>
                <option value="3.5" className="text-text-primary">3.5 - 3.79</option>
                <option value="3.8" className="text-text-primary">3.8 - 3.99</option>
                <option value="4.0" className="text-text-primary">4.0+</option>
              </select>
            </div>

            {/* Deep Match Toggle */}
            <button
              onClick={() => setShowDeepMatch(!showDeepMatch)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showDeepMatch ? "Hide" : "Show"} advanced options for better matching
              <ChevronRight className={clsx("w-4 h-4 transition-transform", showDeepMatch && "rotate-90")} />
            </button>

            {showDeepMatch && (
              <div className="bg-black/20 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current School (boosts matching with same-school mentors)</label>
                  <input
                    type="text"
                    value={currentSchool}
                    onChange={(e) => setCurrentSchool(e.target.value)}
                    placeholder="e.g., Shanghai American School"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Major</label>
                  <input
                    type="text"
                    value={targetMajor}
                    onChange={(e) => setTargetMajor(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Schools (filter by specific schools)</label>
                  <input
                    type="text"
                    value={targetSchools.join(", ")}
                    onChange={(e) => setTargetSchools(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="e.g., Harvard, Stanford, MIT (comma separated)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <button
                  onClick={() => { setTargetMajor(""); setTargetSchools([]); }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear advanced options
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Match Summary */}
          {(selectedInterests.length > 0 || grade) && (
            <div className="bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-4 md:p-6 mb-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Your Match Summary</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-accent-light">Recommended Majors</span>
                  <div className="font-semibold text-lg">
                    {getRecommendedMajors(selectedInterests).join(", ")}
                  </div>
                </div>
                <div>
                  <span className="text-accent-light">Target Schools</span>
                  <div className="font-semibold text-lg">
                    {targetSchools.length > 0
                      ? targetSchools.slice(0, 3).join(", ") + (targetSchools.length > 3 ? "..." : "")
                      : targetMajor
                        ? targetMajor
                        : getRecommendedSchools(selectedInterests, gpa).join(", ")}
                  </div>
                </div>
                <div>
                  <span className="text-accent-light">Matched Consultants</span>
                  <div className="font-semibold text-lg">
                    {matchedConsultants.length} available
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent-dark" />
              <h2 className="text-xl font-bold text-text-primary">
                {showAllConsultants ? "All Consultants" : "Recommended for You"}
              </h2>
              {!showAllConsultants && matchedConsultants.length > 0 && (
                <span className="text-sm text-text-tertiary">({matchedConsultants.length} matched)</span>
              )}
            </div>
            <button
              onClick={() => setShowAllConsultants(!showAllConsultants)}
              className="text-sm text-accent-dark hover:text-accent-dark font-medium"
            >
              {showAllConsultants ? "Show matched only" : "View all"}
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search by name, school, major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Schools</option>
                {["Harvard", "Stanford", "MIT", "Yale", "Princeton", "Columbia", "Cornell", "Duke"].map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Consultant Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonConsultantCard key={i} />)
            ) : (
              filteredConsultants.map((item) => {
                const { consultant, score, reasons } = getConsultantData(item);
                return (
                  <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                    matchScore={score > 0 ? score : undefined}
                    reasons={reasons}
                  />
                );
              })
            )}
          </div>

          {!isLoading && filteredConsultants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-tertiary text-lg">No consultants found</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedSchool(""); setBudget(150); setBudgetUnlimited(true); }}
                className="mt-4 text-accent-dark hover:text-accent-dark font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* University Explorer */}
      {universities.length > 0 && (
        <section className="py-12 bg-card-bg border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">Explore Universities</h2>
                <p className="text-text-secondary text-sm mt-1">{universities.length} US universities with detailed admission data</p>
              </div>
              <Link href="/universities" className="text-accent-dark hover:text-accent font-medium text-sm flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {universities.slice(0, 8).map((u) => (
                <div key={u.id} className="snap-start min-w-[280px] max-w-[320px] flex-shrink-0">
                  <UniversityCard university={u} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              How PathPal Works
            </h2>
            <p className="text-text-secondary">
              Get matched with perfect consultants in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: "1", icon: FileText, title: "Answer Questions", desc: "Tell us your grade, interests, budget" },
              { step: "2", icon: Sparkles, title: "Get Matched", desc: "AI finds consultants who fit you" },
              { step: "3", icon: Calendar, title: "Book a Time", desc: "Choose a slot that works" },
              { step: "4", icon: Video, title: "Start Session", desc: "Video call with your consultant" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forum Preview */}
      <ForumPreview posts={forumPosts} />

      {/* Success Stories */}
      <section id="success-stories" className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Success Stories</h2>
            <p className="text-slate-400">
              Students who got into their dream schools with PathPal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{story.avatar}</div>
                <p className="text-slate-300 mb-4">&ldquo;{story.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold">{story.name}</div>
                  <div className="text-accent-light text-sm">Accepted to {story.school}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-accent-light" />
                </div>
                <span className="text-lg font-bold">PathPal</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Peer-to-peer college counseling. Get matched with verified students at top US universities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-accent-light">Platform</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><button onClick={() => setShowAllConsultants(true)} className="hover:text-white transition-colors">Browse Consultants</button></li>
                <li><Link href="/universities" className="hover:text-white transition-colors">Universities</Link></li>
                <li><Link href="/forum" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/become-consultant" className="hover:text-white transition-colors">Become a Consultant</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-accent-light">Resources</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><Link href="/forum" className="hover:text-white transition-colors">Ask the Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-accent-light">Account</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
            &copy; 2026 PathPal. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}
