"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, GraduationCap, ChevronRight, Sparkles, FileText, Calendar, Video, CheckCircle2, ArrowRight, SlidersHorizontal, X, MessageCircle, Heart, Award, Plus, Menu } from "lucide-react";
import { consultants } from "@/data/consultants";
import { clsx } from "clsx";
import { UserProvider } from "@/context/UserContext";
import AIChat from "@/components/AIChat";
import { samplePosts, Post } from "@/data/forum";

// Interest options
const interests = [
  { id: "stem", label: "STEM", icon: "🔬" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "arts", label: "Arts", icon: "🎨" },
  { id: "social", label: "Social Sciences", icon: "🌍" },
  { id: "health", label: "Health/Pre-Med", icon: "🏥" },
  { id: "humanities", label: "Humanities", icon: "📚" },
];

// US Universities with tiers and GPA requirements
// Tier 1: Most selective (3.8+)
// Tier 2: Very selective (3.5+)
// Tier 3: Selective (3.2+)
// Tier 4: Moderate (3.0+)
const universities = [
  // Tier 1 - Most Selective
  { name: "Harvard University", tier: 1, labels: ["business", "stem", "social", "health"] },
  { name: "Stanford University", tier: 1, labels: ["stem", "business", "arts"] },
  { name: "MIT", tier: 1, labels: ["stem"] },
  { name: "Yale University", tier: 1, labels: ["arts", "humanities", "social"] },
  { name: "Princeton University", tier: 1, labels: ["stem", "humanities"] },
  { name: "Columbia University", tier: 1, labels: ["business", "arts", "stem"] },
  { name: "University of Chicago", tier: 1, labels: ["stem", "business", "humanities"] },
  { name: "University of Pennsylvania", tier: 1, labels: ["business", "stem", "social"] },
  { name: "Caltech", tier: 1, labels: ["stem"] },
  { name: "Brown University", tier: 1, labels: ["humanities", "arts", "social"] },
  { name: "Duke University", tier: 1, labels: ["sports", "health", "business"] },
  { name: "Northwestern University", tier: 1, labels: ["business", "stem", "arts"] },
  { name: "Cornell University", tier: 1, labels: ["stem", "business", "health"] },
  { name: "Johns Hopkins University", tier: 1, labels: ["health", "stem", "social"] },
  { name: "Rice University", tier: 1, labels: ["stem", "arts", "humanities"] },
  { name: "Vanderbilt University", tier: 1, labels: ["social", "health", "business"] },
  { name: "Notre Dame", tier: 1, labels: ["business", "humanities", "social"] },
  { name: "Georgetown University", tier: 1, labels: ["social", "business", "humanities"] },
  { name: "Carnegie Mellon", tier: 1, labels: ["stem", "business", "arts"] },
  { name: "University of California, Berkeley", tier: 1, labels: ["stem", "business"] },
  { name: "University of California, Los Angeles", tier: 1, labels: ["arts", "business", "stem"] },
  { name: "University of Michigan", tier: 1, labels: ["business", "stem", "health"] },
  { name: "University of Southern California", tier: 1, labels: ["arts", "business", "stem"] },
  { name: "NYU", tier: 1, labels: ["arts", "business", "social"] },
  
  // Tier 2 - Very Selective
  { name: "Emory University", tier: 2, labels: ["health", "business", "social"] },
  { name: "Washington University in St. Louis", tier: 2, labels: ["business", "stem", "health"] },
  { name: "University of Virginia", tier: 2, labels: ["business", "humanities", "social"] },
  { name: "Georgia Tech", tier: 2, labels: ["stem", "business"] },
  { name: "University of Florida", tier: 2, labels: ["business", "stem", "health"] },
  { name: "University of North Carolina at Chapel Hill", tier: 2, labels: ["health", "social", "business"] },
  { name: "University of Texas at Austin", tier: 2, labels: ["business", "stem", "arts"] },
  { name: "Boston College", tier: 2, labels: ["business", "humanities", "social"] },
  { name: "Boston University", tier: 2, labels: ["arts", "business", "health"] },
  { name: "College of William & Mary", tier: 2, labels: ["humanities", "social", "stem"] },
  { name: "Wake Forest University", tier: 2, labels: ["business", "health", "humanities"] },
  { name: "University of Wisconsin-Madison", tier: 2, labels: ["stem", "business", "social"] },
  { name: "University of Washington", tier: 2, labels: ["stem", "health", "business"] },
  { name: "University of Illinois at Urbana-Champaign", tier: 2, labels: ["stem", "business"] },
  { name: "Ohio State University", tier: 2, labels: ["stem", "business", "health"] },
  { name: "University of Maryland", tier: 2, labels: ["stem", "business", "social"] },
  { name: "University of Rochester", tier: 2, labels: ["stem", "arts", "health"] },
  { name: "Case Western Reserve University", tier: 2, labels: ["stem", "health", "business"] },
  { name: "Tulane University", tier: 2, labels: ["business", "health", "social"] },
  { name: "University of Georgia", tier: 2, labels: ["business", "social", "arts"] },
  
  // Tier 3 - Selective
  { name: "University of Miami", tier: 3, labels: ["business", "arts", "health"] },
  { name: "University of Colorado Boulder", tier: 3, labels: ["stem", "arts", "business"] },
  { name: "University of Minnesota Twin Cities", tier: 3, labels: ["stem", "business", "health"] },
  { name: "University of Pittsburgh", tier: 3, labels: ["health", "business", "stem"] },
  { name: "University of Arizona", tier: 3, labels: ["stem", "arts", "social"] },
  { name: "University of Utah", tier: 3, labels: ["stem", "health", "arts"] },
  { name: "Arizona State University", tier: 3, labels: ["stem", "business", "arts"] },
  { name: "University of California, Davis", tier: 3, labels: ["stem", "health", "arts"] },
  { name: "University of California, San Diego", tier: 3, labels: ["stem", "health", "social"] },
  { name: "University of California, Irvine", tier: 3, labels: ["stem", "business", "arts"] },
  { name: "University of California, Santa Barbara", tier: 3, labels: ["stem", "arts", "social"] },
  { name: "University of California, Santa Cruz", tier: 3, labels: ["stem", "arts", "humanities"] },
  { name: "Penn State University", tier: 3, labels: ["stem", "business", "social"] },
  { name: "Rutgers University", tier: 3, labels: ["stem", "business", "health"] },
  { name: "University of Connecticut", tier: 3, labels: ["business", "health", "stem"] },
  { name: "University of Iowa", tier: 3, labels: ["business", "health", "arts"] },
  { name: "University of Kansas", tier: 3, labels: ["business", "health", "arts"] },
  { name: "University of Nebraska-Lincoln", tier: 3, labels: ["business", "stem", "arts"] },
  { name: "University of Oklahoma", tier: 3, labels: ["business", "social", "arts"] },
  { name: "University of Tennessee", tier: 3, labels: ["business", "health", "social"] },
  
  // Tier 4 - Moderate
  { name: "University of South Florida", tier: 4, labels: ["business", "health", "arts"] },
  { name: "University of Louisville", tier: 4, labels: ["health", "business", "arts"] },
  { name: "University of Arkansas", tier: 4, labels: ["business", "stem", "social"] },
  { name: "University of Mississippi", tier: 4, labels: ["business", "social", "arts"] },
  { name: "University of Nevada, Las Vegas", tier: 4, labels: ["business", "arts", "social"] },
  { name: "University of New Mexico", tier: 4, labels: ["arts", "social", "health"] },
  { name: "University of Alaska Anchorage", tier: 4, labels: ["stem", "social", "arts"] },
  { name: "University of Hawaii at Manoa", tier: 4, labels: ["arts", "social", "stem"] },
];

// Get universities by tier
const getTierGPA = (tier: number) => {
  switch(tier) {
    case 1: return "3.8+";
    case 2: return "3.5+";
    case 3: return "3.2+";
    case 4: return "3.0+";
    default: return "3.0+";
  }
};

// Map interests to recommended majors
const interestToMajors: Record<string, string[]> = {
  stem: ["Computer Science", "Electrical Engineering", "Data Science", "Mathematics"],
  business: ["Business Analytics", "Economics", "Finance", "Marketing"],
  arts: ["Visual Arts", "Film & Media", "Music", "Design"],
  social: ["International Relations", "Political Science", "Sociology", "Psychology"],
  health: ["Biology", "Neuroscience", "Pre-Medicine", "Public Health"],
  humanities: ["Literature", "History", "Philosophy", "Comparative Literature"],
};

// Get recommended majors based on interests
const getRecommendedMajors = (selectedInterests: string[]) => {
  if (selectedInterests.length === 0) {
    return ["Explore majors →"];
  }
  
  // Collect all majors from selected interests
  const majors: string[] = [];
  selectedInterests.forEach(interest => {
    if (interestToMajors[interest]) {
      majors.push(...interestToMajors[interest]);
    }
  });
  
  // Return unique majors, limited to 3
  return [...new Set(majors)].slice(0, 3);
};

// Get recommended schools based on interests and GPA
const getRecommendedSchools = (selectedInterests: string[], userGPA?: string) => {
  let filtered = universities;
  
  // Filter by GPA if provided
  if (userGPA) {
    const gpaThreshold = parseFloat(userGPA);
    filtered = universities.filter(u => u.tier <= 4 - Math.floor(gpaThreshold - 2.5));
  }
  
  if (selectedInterests.length === 0) return filtered.slice(0, 3).map(s => s.name);
  
  // Score each school based on matching labels
  const scored = filtered.map(school => {
    const matchCount = school.labels.filter(label => selectedInterests.includes(label)).length;
    return { ...school, matchCount };
  }).sort((a, b) => b.matchCount - a.matchCount);
  
  // Return top 3 matched schools (no GPA shown)
  return scored.slice(0, 3).map(s => s.name);
};

// Grade levels
const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];

// Budget options
const budgetOptions = [
  { label: "< $30", value: 30 },
  { label: "$30-50", value: 50 },
  { label: "$50-80", value: 80 },
  { label: "$80-100", value: 100 },
  { label: "$100+", value: 150 },
];

export default function Home() {
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
  const [gpaRange, setGpaRange] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc">("rating");
  const [showAllConsultants, setShowAllConsultants] = useState(false);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Forum posts state
  const [forumPosts, setForumPosts] = useState<Post[]>(samplePosts);

  // Load forum posts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("forum_posts");
      if (stored) {
        const storedPosts = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          comments: p.comments?.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            replies: c.replies?.map((r: any) => ({
              ...r,
              createdAt: new Date(r.createdAt)
            })) || []
          })) || []
        }));
        
        const allPosts = [...storedPosts, ...samplePosts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setForumPosts(allPosts);
      }
    } catch (e) {
      console.error("Failed to load forum posts:", e);
    }
  }, []);

  // Toggle interest
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Simple matching logic
  const getMatchedConsultants = () => {
    let matched = consultants.map(c => {
      let score = 0;
      let reasons: string[] = [];
      
      // Budget filter (using 60-min session price)
      if (!budgetUnlimited && c.services[1].price > budget) {
        return null;
      }
      
      // GPA filter - user's GPA must meet consultant's minimum requirement
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
          reasons.push("匹配目标专业");
        }
      }
      
      // Deep match: target schools
      if (showDeepMatch && targetSchools.length > 0) {
        const schoolMatch = targetSchools.some(s => 
          c.studentSuccess.some(ss => ss.toLowerCase().includes(s.toLowerCase()))
        );
        if (schoolMatch) {
          score += 25;
          reasons.push("有目标校经验");
        }
      }
      
      // Current school boost (same school alumni)
      if (currentSchool && c.school.toLowerCase().includes(currentSchool.toLowerCase())) {
        score += 15;
        reasons.push("同校学长学姐");
      }
      
      return { consultant: c, score, reasons: reasons.slice(0, 2) };
    }).filter(Boolean).sort((a: any, b: any) => b.score - a.score);
    
    return matched;
  };

  const matchedConsultants = getMatchedConsultants();

  const displayedConsultants = showAllConsultants
    ? consultants
    : matchedConsultants.slice(0, 5);

  const filteredConsultants = displayedConsultants
    .filter((c: any) => {
      const consultant = 'consultant' in c ? c.consultant : c;
      const matchesSearch =
        consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.specialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSchool = !selectedSchool || consultant.school === selectedSchool;
      return matchesSearch && matchesSchool;
    })
    .sort((a: any, b: any) => {
      const consultantA = 'consultant' in a ? a.consultant : a;
      const consultantB = 'consultant' in b ? b.consultant : b;
      const scoreA = 'score' in a ? a.score : 0;
      const scoreB = 'score' in b ? b.score : 0;
      
      // Default to sorting by match score when showing recommendations
      if (!showAllConsultants && sortBy === "rating") {
        return scoreB - scoreA;
      }
      if (sortBy === "rating") return consultantB.rating - consultantA.rating;
      if (sortBy === "price-asc") return consultantA.services[0].price - consultantB.services[0].price;
      if (sortBy === "price-desc") return consultantB.services[0].price - consultantA.services[0].price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">PathPal</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setShowAllConsultants(true)} className="text-slate-600 hover:text-slate-900 font-medium">All Consultants</button>
              <Link href="/forum" className="text-slate-600 hover:text-slate-900 font-medium">Community</Link>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium">How It Works</a>
              <a href="#success-stories" className="text-slate-600 hover:text-slate-900 font-medium">Success Stories</a>
            </nav>

            <Link href="/become-consultant" className="hidden md:block bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
              Become a Consultant
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <button 
              onClick={() => { setShowAllConsultants(true); setMobileMenuOpen(false); }}
              className="block w-full text-left text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              All Consultants
            </button>
            <Link 
              href="/forum" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Community
            </Link>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              How It Works
            </a>
            <a 
              href="#success-stories" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Success Stories
            </a>
            <Link 
              href="/become-consultant" 
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm text-center"
            >
              Become a Consultant
            </Link>
          </div>
        )}
      </header>

      {/* Quick Finder Hero */}
      <section className="bg-slate-900 text-white py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Find Your Perfect <span className="text-emerald-400">College Consultant</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Answer a few questions to get matched with top college students
            </p>
          </div>

          {/* Quick Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 space-y-5">
            {/* Row 1: Grade + Interests */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Grade Level *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" className="text-slate-900">Select your grade</option>
                  {grades.map(g => <option key={g} value={g} className="text-slate-900">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Interests *</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                        selectedInterests.includes(item.id)
                          ? "bg-emerald-500 text-slate-900"
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

            {/* Row 2: Budget Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget per session within 
                {budgetUnlimited ? <span className="text-emerald-400 ml-2">(No limit)</span> : <span className="ml-2">${budget}</span>}
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
                    budgetUnlimited ? "bg-emerald-500 text-slate-900" : "bg-white/10 text-slate-400 hover:text-white"
                  )}
                >
                  Any
                </button>
              </div>
            </div>

            {/* Row 3: GPA (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GPA <span className="text-slate-500">(Optional - helps filter target schools)</span>
              </label>
              <select
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full md:w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-slate-900">Select GPA</option>
                <option value="3.0" className="text-slate-900">Below 3.5</option>
                <option value="3.5" className="text-slate-900">3.5 - 3.79</option>
                <option value="3.8" className="text-slate-900">3.8 - 3.99</option>
                <option value="4.0" className="text-slate-900">4.0+</option>
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

            {/* Deep Match Section */}
            {showDeepMatch && (
              <div className="bg-black/20 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current School (boosts matching with same-school mentors)</label>
                  <input
                    type="text"
                    value={currentSchool}
                    onChange={(e) => setCurrentSchool(e.target.value)}
                    placeholder="e.g., Shanghai American School"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Major</label>
                  <input
                    type="text"
                    value={targetMajor}
                    onChange={(e) => setTargetMajor(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Schools (filter by specific schools)</label>
                  <input
                    type="text"
                    value={targetSchools.join(", ")}
                    onChange={(e) => setTargetSchools(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="e.g., Harvard, Stanford, MIT (comma separated)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    setTargetMajor("");
                    setTargetSchools([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear advanced options
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results or All Consultants */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary - show when user has entered any criteria OR just has interests selected */}
          {(selectedInterests.length > 0 || grade) && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-6 mb-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Your Match Summary</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-emerald-100">Recommended Majors</span>
                  <div className="font-semibold text-lg">
                    {getRecommendedMajors(selectedInterests).join(", ")}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-100">Target Schools</span>
                  <div className="font-semibold text-lg">
                    {targetSchools.length > 0 
                      ? targetSchools.slice(0, 3).join(", ") + (targetSchools.length > 3 ? "..." : "")
                      : targetMajor 
                        ? targetMajor
                        : getRecommendedSchools(selectedInterests, gpa).join(", ")}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-100">Matched Consultants</span>
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
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                {showAllConsultants ? "All Consultants" : "Recommended for You"}
              </h2>
              {!showAllConsultants && matchedConsultants.length > 0 && (
                <span className="text-sm text-slate-500">({matchedConsultants.length} matched)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllConsultants(!showAllConsultants)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {showAllConsultants ? "Show matched only" : "View all"}
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, school, major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All Schools</option>
                {["Harvard", "Stanford", "MIT", "Yale", "Princeton", "Columbia", "Cornell", "Duke"].map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Consultant Grid */}
          <div className="grid gap-4">
            {filteredConsultants.map((item: any) => {
              const consultant = 'consultant' in item ? item.consultant : item;
              const matchScore = 'score' in item ? item.score : null;
              const reasons = 'reasons' in item ? item.reasons : [];

              return (
                <Link
                  key={consultant.id}
                  href={`/consultant/${consultant.id}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-4 md:p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-200"
                >
                  <div className="flex gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={consultant.avatar}
                        alt={consultant.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-100 object-cover"
                      />
                      {matchScore && matchScore > 0 && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {matchScore}%
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {consultant.name}
                            </h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{consultant.year}</span>
                          </div>
                          <p className="text-slate-600">{consultant.school}</p>
                          <p className="text-sm text-slate-500">{consultant.major} · GPA {consultant.gpa}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl md:text-2xl font-bold text-slate-900">${consultant.services[0].price}</p>
                          <p className="text-slate-500 text-sm">/{consultant.services[0].duration}min</p>
                        </div>
                      </div>

                      <p className="text-slate-600 mt-2 md:mt-3 line-clamp-2 text-sm md:text-base">{consultant.bio}</p>

                      {reasons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {reasons.map((reason: string, idx: number) => (
                            <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                        {consultant.specialties.slice(0, 4).map((specialty: string) => (
                          <span key={specialty} className="px-2 md:px-3 py-1 bg-slate-100 text-slate-600 text-xs md:text-sm rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-slate-900 text-sm md:text-base">{consultant.rating}</span>
                            <span className="text-slate-500 text-sm">({consultant.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium hidden md:inline">{consultant.studentSuccess.slice(0, 2).join(", ")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-900 font-medium group-hover:translate-x-1 transition-transform text-sm md:text-base">
                          <span>View Profile</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredConsultants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No consultants found</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedSchool(""); setBudget(150); setBudgetUnlimited(true); }}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              How PathPal Works
            </h2>
            <p className="text-slate-600">
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
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forum Preview */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Community</h2>
              <p className="text-slate-600">Connect with peers and consultants</p>
            </div>
            <Link 
              href="/forum" 
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumPosts.slice(0, 3).map((post) => (
              <Link 
                key={post.id} 
                href={`/forum/${post.id}`}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                    {post.author.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-900 text-sm truncate">{post.author.name}</span>
                      {post.author.isConsultant && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full flex-shrink-0">
                          <Award className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm md:text-base">{post.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments.length}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/forum/new"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Start a Discussion
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Success Stories</h2>
            <p className="text-slate-400">
              Students who got into their dream schools with PathPal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Alex T.", school: "Harvard", quote: "My consultant helped me craft a compelling narrative that stood out.", avatar: "👨🏿" },
              { name: "Sarah M.", school: "Stanford", quote: "The mock interview sessions were incredibly helpful!", avatar: "👩🏻" },
              { name: "James K.", school: "MIT", quote: "Got into MIT thanks to the resume guidance.", avatar: "👨🏻" },
            ].map((story, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{story.avatar}</div>
                <p className="text-slate-300 mb-4">"{story.quote}"</p>
                <div>
                  <div className="font-semibold">{story.name}</div>
                  <div className="text-emerald-400 text-sm">Accepted to {story.school}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">PathPal</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 PathPal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}