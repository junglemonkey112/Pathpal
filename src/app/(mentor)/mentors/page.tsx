"use client";

import { useState } from "react";
import { getAllMentors } from "@/data/mentors";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/mentor-i18n";
import MentorCard from "@/components/MentorCard";
import { Search } from "lucide-react";

export default function MentorsPage() {
  const allMentors = getAllMentors();
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const [showAllTags, setShowAllTags] = useState(false);

  // Tags sorted by frequency (descending)
  const tagCounts = new Map<string, number>();
  allMentors.forEach((m) => {
    const tags = lang === "zh" ? m.service_tags : m.service_tags_en;
    tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
  });
  const allTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const VISIBLE_COUNT = 8; // ~2 rows worth
  const visibleTags = showAllTags ? allTags : allTags.slice(0, VISIBLE_COUNT);
  const hasMore = allTags.length > VISIBLE_COUNT;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filteredMentors = allMentors.filter((mentor) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      mentor.name.toLowerCase().includes(q) ||
      mentor.school.toLowerCase().includes(q) ||
      mentor.major.toLowerCase().includes(q) ||
      mentor.major_en.toLowerCase().includes(q) ||
      mentor.tagline.toLowerCase().includes(q) ||
      mentor.tagline_en.toLowerCase().includes(q);

    const matchesTag =
      selectedTags.size === 0 ||
      [...selectedTags].some(
        (tag) =>
          mentor.service_tags.includes(tag) ||
          mentor.service_tags_en.includes(tag)
      );

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Hero — compact */}
      <div className="max-w-2xl mx-auto text-center mb-6">
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-[-1.5px] leading-[1.0] mb-2">
          {t(ui.hero_title.zh, ui.hero_title.en)}
        </h1>
        <p className="text-[16px] text-[#615d59]">
          {t(ui.hero_subtitle.zh, ui.hero_subtitle.en)}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-4">
        <div
          className="relative rounded-[4px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a39e98]"
          />
          <input
            type="text"
            placeholder={t(ui.search_placeholder.zh, ui.search_placeholder.en)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[14px] placeholder:text-[#a39e98] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#097fe8] rounded-[4px]"
          />
        </div>
      </div>

      {/* Filter pills — wrap, 2 rows default, expandable */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTags(new Set())}
            className={`px-3 py-1 rounded-[9999px] text-[12px] font-semibold tracking-[0.125px] transition-all ${
              selectedTags.size === 0
                ? "bg-[rgba(0,0,0,0.95)] text-white"
                : "bg-[#f2f9ff] text-[#097fe8] hover:bg-[#e6f2ff]"
            }`}
          >
            {t(ui.filter_all.zh, ui.filter_all.en)}
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-[9999px] text-[12px] font-semibold tracking-[0.125px] transition-all ${
                selectedTags.has(tag)
                  ? "bg-[rgba(0,0,0,0.95)] text-white"
                  : "bg-[#f2f9ff] text-[#097fe8] hover:bg-[#e6f2ff]"
              }`}
            >
              {tag}
            </button>
          ))}
          {hasMore && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-3 py-1 rounded-[9999px] text-[12px] font-semibold tracking-[0.125px] text-[#615d59] hover:text-[rgba(0,0,0,0.95)] transition-colors"
            >
              {showAllTags
                ? t("收起 ↑", "Less ↑")
                : t(`更多 +${allTags.length - VISIBLE_COUNT}`, `More +${allTags.length - VISIBLE_COUNT}`)}
            </button>
          )}
        </div>
      </div>

      {/* Mentor grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[16px] text-[#615d59]">
            {t(ui.no_results.zh, ui.no_results.en)}
          </p>
        </div>
      )}

      {/* Bottom CTA — warm white section */}
      <div className="text-center mt-16 py-12 -mx-6 px-6 bg-[#f6f5f4]">
        <h3 className="text-[26px] font-bold tracking-[-0.625px] mb-3">
          {t(ui.become_mentor_title.zh, ui.become_mentor_title.en)}
        </h3>
        <p className="text-[16px] text-[#615d59] mb-6">
          {t(ui.become_mentor_desc.zh, ui.become_mentor_desc.en)}
        </p>
        <a
          href="/become-consultant"
          className="inline-block px-5 py-2.5 bg-[#0075de] text-white text-[15px] font-semibold rounded-[4px] hover:bg-[#005bab] transition-colors"
        >
          {t(ui.become_mentor_cta.zh, ui.become_mentor_cta.en)}
        </a>
      </div>
    </div>
  );
}
