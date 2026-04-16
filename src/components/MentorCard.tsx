"use client";

import Link from "next/link";
import { Star, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/mentor-i18n";
import type { Mentor } from "@/data/mentors";

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  const { lang, t } = useLanguage();
  const lowestPrice = Math.min(...mentor.services.map((s) => s.price));

  return (
    <Link href={`/mentor/${mentor.id}`} className="block group">
      <div
        className="bg-white rounded-[12px] overflow-hidden transition-all duration-200 h-full flex flex-col hover:shadow-[rgba(0,0,0,0.08)_0px_4px_16px]"
        style={{
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <div className="p-5 flex flex-col flex-1">
          {/* Avatar + Info */}
          <div className="flex items-start gap-4 mb-4">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-[52px] h-[52px] rounded-full bg-[#f6f5f4] flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-[16px] font-bold text-[rgba(0,0,0,0.95)] tracking-[-0.25px] group-hover:text-[#0075de] transition-colors">
                  {mentor.name}
                </h3>
                {mentor.verified && (
                  <CheckCircle
                    size={14}
                    className="text-[#2a9d99] flex-shrink-0"
                  />
                )}
              </div>
              <p className="text-[14px] font-medium text-[rgba(0,0,0,0.95)]">
                {mentor.school}
              </p>
              <p className="text-[13px] text-[#615d59]">
                {t(mentor.major, mentor.major_en)} · {t(mentor.year, mentor.year_en)}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[14px] text-[rgba(0,0,0,0.95)] leading-[1.5] mb-4 flex-1 line-clamp-3">
            &ldquo;{t(mentor.tagline, mentor.tagline_en)}&rdquo;
          </p>

          {/* Tags — Notion pill badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(lang === "zh" ? mentor.service_tags : mentor.service_tags_en)
              .slice(0, 3)
              .map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[9999px] text-[12px] font-semibold bg-[#f2f9ff] text-[#097fe8] tracking-[0.125px]"
                >
                  {tag}
                </span>
              ))}
            {mentor.service_tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-[9999px] text-[12px] text-[#a39e98]">
                +{mentor.service_tags.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-[rgba(0,0,0,0.95)] text-[rgba(0,0,0,0.95)]" />
              <span className="text-[13px] font-bold text-[rgba(0,0,0,0.95)]">
                {mentor.rating}
              </span>
              <span className="text-[13px] text-[#a39e98]">
                ({mentor.review_count})
              </span>
            </div>
            <div>
              <span className="text-[15px] font-bold text-[rgba(0,0,0,0.95)]">
                ¥{lowestPrice}
              </span>
              <span className="text-[13px] text-[#615d59]">
                {" "}{t(ui.per_session.zh, ui.per_session.en)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
