import Link from "next/link";
import { MapPin, GraduationCap, DollarSign } from "lucide-react";
import type { SupabaseUniversity } from "@/lib/db/universities";

interface UniversityCardProps {
  university: SupabaseUniversity;
  compact?: boolean;
}

export default function UniversityCard({ university: u, compact = false }: UniversityCardProps) {
  return (
    <Link
      href={`/university/${u.id}`}
      className="group bg-card-bg rounded-2xl border border-border p-5 hover:shadow-lg hover:border-border transition-all block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary group-hover:text-accent-dark transition-colors truncate">
            {u.name_en}
          </h3>
          {u.location_en && (
            <p className="text-text-tertiary text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{u.location_en}</span>
            </p>
          )}
        </div>
        {u.ranking && (
          <div className="flex-shrink-0 ml-3 w-9 h-9 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">#{u.ranking}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
        {u.acceptance_rate && (
          <div>
            <span className="text-text-tertiary">Accept:</span>{" "}
            <span className="font-medium text-text-primary">{u.acceptance_rate}</span>
          </div>
        )}
        {u.avg_gpa && (
          <div>
            <span className="text-text-tertiary">GPA:</span>{" "}
            <span className="font-medium text-text-primary">{u.avg_gpa.toFixed(2)}</span>
          </div>
        )}
        {u.avg_sat && (
          <div>
            <span className="text-text-tertiary">SAT:</span>{" "}
            <span className="font-medium text-text-primary">{u.avg_sat}</span>
          </div>
        )}
        {u.tuition && (
          <div>
            <span className="text-text-tertiary">Tuition:</span>{" "}
            <span className="font-medium text-text-primary">{u.tuition}</span>
          </div>
        )}
      </div>

      {!compact && u.strong_majors_en && u.strong_majors_en.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {u.strong_majors_en.slice(0, 3).map((major) => (
            <span key={major} className="px-2 py-0.5 bg-accent-bg text-accent-dark text-xs rounded-full">
              {major}
            </span>
          ))}
          {u.strong_majors_en.length > 3 && (
            <span className="text-text-tertiary text-xs">+{u.strong_majors_en.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
