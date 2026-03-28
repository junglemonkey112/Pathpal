"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { Search, GraduationCap, Globe, ShieldCheck, Users, BookOpen, TrendingDown, ChevronRight, Star, Lock, DollarSign, Trophy } from "lucide-react";
import { counsellors, Counsellor } from "@/data/counsellors";
import { clsx } from "clsx";
import AIChat from "@/components/AIChat";
import CounsellorCard from "@/components/CounsellorCard";
import ForumPreview from "@/components/ForumPreview";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { samplePosts, Post } from "@/data/forum";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const COUNTRIES = ["China", "South Korea", "Japan", "India", "All Countries"];
const LANGUAGES = ["English", "Mandarin", "Korean", "Japanese", "Hindi", "All Languages"];
const SPECIALTIES = ["STEM", "Pre-Medicine", "Business", "Liberal Arts", "Architecture", "All Specialties"];

export default function Home() {
  const { user } = useUser();
  const { t } = useLanguage();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  // Forum posts
  const [forumPosts, setForumPosts] = useState<Post[]>(samplePosts);

  useEffect(() => {
    startTransition(() => {
      try {
        const stored = localStorage.getItem("forum_posts");
        if (stored) {
          const storedPosts = JSON.parse(stored).map((p: Post) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            comments: (p.comments ?? []).map((c: Post["comments"][0]) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              replies: (c.replies ?? []).map((r) => ({
                ...r,
                createdAt: new Date(r.createdAt),
              })),
            })),
          }));
          const allPosts = [...storedPosts, ...samplePosts].sort(
            (a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setForumPosts(allPosts);
        }
      } catch {
        // ignore localStorage errors
      }
    });
  }, []);

  // Filtered counsellors
  const filteredCounsellors = counsellors.filter((c: Counsellor) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry =
      selectedCountry === "All Countries" || c.country === selectedCountry;

    const matchesLanguage =
      selectedLanguage === "All Languages" || c.languages.includes(selectedLanguage);

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      c.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesSearch && matchesCountry && matchesLanguage && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar homeLinks />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-16 pb-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-[10%] text-7xl">🇰🇷</div>
          <div className="absolute top-16 right-[8%] text-7xl">🇨🇳</div>
          <div className="absolute bottom-12 left-[5%] text-7xl">🇯🇵</div>
          <div className="absolute bottom-8 right-[12%] text-6xl">🇮🇳</div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            All counsellors verified with enrollment proof + government ID
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mb-10 flex-wrap">
            {[
              { icon: Globe, label: t("hero.stats.countries") },
              { icon: BookOpen, label: t("hero.stats.languages") },
              { icon: Users, label: t("hero.stats.stories") },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>

          <a
            href="#counsellors"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-colors text-sm sm:text-base"
          >
            {t("hero.cta")} <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Counsellor Discovery */}
      <section id="counsellors" className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("nav.allCounsellors")}</h2>
            <p className="text-slate-500 text-sm">Filter by country, language, or specialty</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t("hero.filters.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Country filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>

            {/* Specialty filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500 mb-4">
            {filteredCounsellors.length} counsellor{filteredCounsellors.length !== 1 ? "s" : ""} found
          </p>

          {/* Counsellor grid */}
          <div className="grid gap-4">
            {filteredCounsellors.map((c) => (
              <CounsellorCard key={c.id} counsellor={c} />
            ))}
            {filteredCounsellors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No counsellors match your filters.</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCountry("All Countries"); setSelectedLanguage("All Languages"); setSelectedSpecialty("All Specialties"); }}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t("howItWorks.title")}</h2>
            <p className="text-slate-500">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {(["browse", "match", "book", "start"] as const).map((key, i) => (
              <div key={key} className="text-center">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{t(`howItWorks.steps.${key}.title`)}</h3>
                <p className="text-sm text-slate-500">{t(`howItWorks.steps.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section id="for-parents" className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              {t("forParents.title")}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("forParents.subtitle")}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {t("forParents.insight")}
            </p>
          </div>

          {/* Three parent concerns */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {([
              { icon: Lock, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", titleKey: "forParents.concerns.safe.title", descKey: "forParents.concerns.safe.desc" },
              { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", titleKey: "forParents.concerns.worth.title", descKey: "forParents.concerns.worth.desc" },
              { icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", titleKey: "forParents.concerns.effective.title", descKey: "forParents.concerns.effective.desc" },
            ] as const).map(({ icon: Icon, color, bg, titleKey, descKey }) => (
              <div key={titleKey} className={`rounded-2xl p-5 border ${bg}`}>
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <h3 className="font-bold text-white mb-2">{t(titleKey)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-lg">{t("forParents.comparison.traditional")}</h3>
              </div>
              <div className="space-y-4">
                {([
                  ["forParents.features.price", "forParents.features.priceTraditional"],
                  ["forParents.features.package", "forParents.features.packageTraditional"],
                  ["forParents.features.counsellor", "forParents.features.counsellorTraditional"],
                  ["forParents.features.perspective", "forParents.features.perspectiveTraditional"],
                ] as const).map(([labelKey, valueKey]) => (
                  <div key={labelKey} className="flex justify-between items-start gap-4">
                    <span className="text-slate-400 text-sm">{t(labelKey)}</span>
                    <span className="text-red-300 text-sm font-medium text-right">{t(valueKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-emerald-300">{t("forParents.comparison.pathpal")}</h3>
              </div>
              <div className="space-y-4">
                {([
                  ["forParents.features.price", "forParents.features.pricePal"],
                  ["forParents.features.package", "forParents.features.packagePal"],
                  ["forParents.features.counsellor", "forParents.features.counsellorPal"],
                  ["forParents.features.perspective", "forParents.features.perspectivePal"],
                ] as const).map(([labelKey, valueKey]) => (
                  <div key={labelKey} className="flex justify-between items-start gap-4">
                    <span className="text-slate-300 text-sm">{t(labelKey)}</span>
                    <span className="text-emerald-300 text-sm font-semibold text-right">{t(valueKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust line + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {t("forParents.trust")}
            </p>
            <a
              href="#counsellors"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              {t("forParents.cta")} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t("nav.successStories")}</h2>
            <p className="text-slate-500">Students who made it to their dream schools</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Min-jun P.", flag: "🇰🇷", school: "CMU Computer Science", quote: "Jessica helped me reframe my olympiad experience as a personal story, not a trophy list. CMU said yes.", counsellor: "Jessica Kim" },
              { name: "Xiaoyu W.", flag: "🇨🇳", school: "Yale University", quote: "Marcus showed me how to write authentically in English about growing up in Beijing. My essays finally felt like me.", counsellor: "Marcus Chen" },
              { name: "Haruto S.", flag: "🇯🇵", school: "Caltech", quote: "Yuki understood my robotics background in a way no one else could. He helped me tell the story behind the trophies.", counsellor: "Yuki Tanaka" },
            ].map((story) => (
              <div key={story.name} className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-700 mb-4 text-sm leading-relaxed">&ldquo;{story.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{story.flag}</span>
                      <span className="font-semibold text-slate-900 text-sm">{story.name}</span>
                    </div>
                    <span className="text-emerald-600 text-xs font-medium">Accepted to {story.school}</span>
                  </div>
                  <span className="text-xs text-slate-400">via {story.counsellor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forum Preview */}
      <ForumPreview posts={forumPosts} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">PathPal</span>
              </div>
              <p className="text-sm max-w-xs">Every student deserves a guide who&apos;s been there.</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <LanguageSwitcher />
              <div className="flex gap-4 text-sm">
                <Link href="/forum" className="hover:text-white transition-colors">{t("nav.community")}</Link>
                <Link href="/become-counsellor" className="hover:text-white transition-colors">{t("nav.becomeCounsellor")}</Link>
                <Link href="/login" className="hover:text-white transition-colors">{t("nav.signIn")}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-xs text-center">
            &copy; 2026 PathPal. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}
