"use client";

import Link from "next/link";
import { Star, ShieldCheck, ChevronRight, Globe } from "lucide-react";
import { Counsellor } from "@/data/counsellors";
import { useLanguage } from "@/context/LanguageContext";

interface CounsellorCardProps {
  counsellor: Counsellor;
  matchScore?: number;
  reasons?: string[];
}

export default function CounsellorCard({ counsellor, matchScore, reasons = [] }: CounsellorCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/counsellor/${counsellor.id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-4 md:p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-200"
    >
      <div className="flex gap-4 md:gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={counsellor.avatar}
            alt={counsellor.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-100 object-cover"
          />
          {counsellor.verificationStatus === "verified" && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {matchScore != null && matchScore > 0 && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              {matchScore}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Name + country + year */}
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {counsellor.name}
                </h3>
                <span className="text-base" title={counsellor.country}>{counsellor.countryFlag}</span>
                {counsellor.verificationStatus === "verified" && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                    {t("counsellor.verified")}
                  </span>
                )}
              </div>
              <p className="text-slate-700 font-medium">{counsellor.school}</p>
              <p className="text-sm text-slate-500">{counsellor.major} · {counsellor.year}</p>

              {/* Languages */}
              <div className="flex items-center gap-1 mt-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{counsellor.languages.join(", ")}</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-400 mb-0.5">{t("counsellor.from")}</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">${counsellor.services[0].price}</p>
              <p className="text-slate-500 text-xs">{t("counsellor.session")}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-600 mt-2 line-clamp-2 text-sm">{counsellor.bio}</p>

          {/* Match reasons */}
          {reasons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {reasons.map((reason, idx) => (
                <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                  ✓ {reason}
                </span>
              ))}
            </div>
          )}

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mt-3">
            {counsellor.specialties.slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                {s}
              </span>
            ))}
          </div>

          {/* Footer: rating + student success + CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-slate-900 text-sm">{counsellor.rating}</span>
                <span className="text-slate-400 text-xs">({counsellor.reviewCount})</span>
              </div>
              {counsellor.studentSuccess.length > 0 && (
                <span className="text-xs text-slate-500 hidden md:inline">
                  → {counsellor.studentSuccess.slice(0, 2).join(", ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium group-hover:translate-x-1 transition-transform text-sm">
              <span>{t("counsellor.viewProfile")}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
