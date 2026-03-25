import Link from "next/link";
import { Star, CheckCircle2, ChevronRight } from "lucide-react";
import { Consultant } from "@/data/consultants";

interface ConsultantCardProps {
  consultant: Consultant;
  matchScore?: number;
  reasons?: string[];
}

export default function ConsultantCard({ consultant, matchScore, reasons = [] }: ConsultantCardProps) {
  return (
    <Link
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
          {matchScore != null && matchScore > 0 && (
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
              {reasons.map((reason, idx) => (
                <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                  {reason}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
            {consultant.specialties.slice(0, 4).map((specialty) => (
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
}
