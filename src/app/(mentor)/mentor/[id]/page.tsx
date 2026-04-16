"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMentorById } from "@/data/mentors";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/mentor-i18n";
import type { Mentor, ApplicationResult } from "@/data/mentors";
import {
  Star,
  CheckCircle,
  ChevronLeft,
  Clock,
  MessageCircle,
  X,
  Play,
} from "lucide-react";

/* ─── Helpers ─── */

function ResultBadge({ result }: { result: ApplicationResult["result"] }) {
  const { t } = useLanguage();
  const styles = {
    accepted: "bg-[#e8f5e9] text-[#2a9d99]",
    denied: "bg-[#fce4ec] text-[#d32f2f]",
    waitlisted: "bg-[#fff3e0] text-[#dd5b00]",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-[9999px] text-[12px] font-semibold tracking-[0.125px] ${styles[result]}`}
    >
      {t(
        ui[`result_${result}` as keyof typeof ui].zh,
        ui[`result_${result}` as keyof typeof ui].en
      )}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= Math.round(rating)
              ? "fill-[rgba(0,0,0,0.95)] text-[rgba(0,0,0,0.95)]"
              : "text-[rgba(0,0,0,0.1)]"
          }
        />
      ))}
    </div>
  );
}

/* ─── Booking Sidebar ─── */

function BookingSidebar({
  mentor,
  onBook,
}: {
  mentor: Mentor;
  onBook: () => void;
}) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState(0);

  return (
    <div
      className="bg-white rounded-[12px] p-6"
      style={{ border: "1px solid rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-baseline gap-1.5 mb-5">
        <span className="text-[22px] font-bold text-[rgba(0,0,0,0.95)] tracking-[-0.25px]">
          ¥{mentor.services[selected].price}
        </span>
        <span className="text-[14px] text-[#615d59]">
          / {mentor.services[selected].duration} min
        </span>
      </div>

      <div className="space-y-2 mb-5">
        {mentor.services.map((svc, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-4 py-3 rounded-[4px] border transition-all ${
              selected === idx
                ? "border-[rgba(0,0,0,0.95)] bg-[#f6f5f4]"
                : "border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#a39e98]" />
                <span className="text-[14px] font-medium">
                  {t(svc.name, svc.name_en)}
                </span>
              </div>
              <span className="text-[14px] font-bold">¥{svc.price}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBook}
        className="w-full py-3 bg-[#0075de] hover:bg-[#005bab] text-white text-[15px] font-semibold rounded-[4px] transition-colors"
      >
        {t(ui.booking_cta.zh, ui.booking_cta.en)}
      </button>

      <p className="text-[12px] text-[#a39e98] text-center mt-3">
        {t(ui.booking_note.zh, ui.booking_note.en)}
      </p>
    </div>
  );
}

/* ─── Booking Modal ─── */

function BookingModal({
  mentor,
  onClose,
}: {
  mentor: Mentor;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-[16px] max-w-[400px] w-full p-7"
        style={{
          boxShadow:
            "rgba(0,0,0,0.01) 0px 1px 3px, rgba(0,0,0,0.02) 0px 3px 7px, rgba(0,0,0,0.02) 0px 7px 15px, rgba(0,0,0,0.04) 0px 14px 28px, rgba(0,0,0,0.05) 0px 23px 52px",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-[4px] bg-[rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-[rgba(0,0,0,0.1)] transition-colors"
        >
          <X size={14} />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#f2f9ff] flex items-center justify-center mx-auto mb-5">
            <MessageCircle size={20} className="text-[#0075de]" />
          </div>
          <h3 className="text-[22px] font-bold tracking-[-0.25px] mb-2">
            {t(ui.booking_modal_title.zh, ui.booking_modal_title.en)}
          </h3>
          <p className="text-[14px] text-[#615d59] mb-6 leading-relaxed">
            {t(ui.booking_modal_desc.zh, ui.booking_modal_desc.en)}
          </p>

          <div className="bg-[#f6f5f4] rounded-[8px] p-5 mb-6">
            <p className="text-[12px] text-[#a39e98] mb-1 uppercase tracking-wider font-semibold">
              {t(ui.booking_wechat_label.zh, ui.booking_wechat_label.en)}
            </p>
            <p className="text-[20px] font-bold font-mono">
              {mentor.wechat_contact}
            </p>
          </div>

          <div className="text-left space-y-3 text-[14px] text-[#615d59]">
            {[ui.booking_step1, ui.booking_step2, ui.booking_step3].map(
              (step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#f2f9ff] flex items-center justify-center text-[11px] font-bold text-[#0075de] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{t(step.zh, step.en)}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function MentorProfilePage() {
  const params = useParams();
  const mentor = getMentorById(params.id as string);
  const { lang, t } = useLanguage();
  const [showBooking, setShowBooking] = useState(false);

  if (!mentor) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <h1 className="text-[22px] font-bold mb-4">Mentor not found</h1>
        <Link href="/mentors" className="text-[14px] text-[#0075de] hover:underline">
          ← {t(ui.back.zh, ui.back.en)}
        </Link>
      </div>
    );
  }

  const tags = lang === "zh" ? mentor.service_tags : mentor.service_tags_en;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/mentors"
        className="inline-flex items-center gap-1 text-[14px] text-[#615d59] hover:text-[rgba(0,0,0,0.95)] transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        {t(ui.back.zh, ui.back.en)}
      </Link>

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">
        {/* ── Left Column ── */}
        <div>
          {/* Hero */}
          <section className="flex items-start gap-5 mb-8">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] rounded-full bg-[#f6f5f4] flex-shrink-0"
            />
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[28px] font-bold tracking-[-0.625px] leading-tight">
                  {mentor.name}
                </h1>
                {mentor.verified && (
                  <CheckCircle size={18} className="text-[#2a9d99] flex-shrink-0" />
                )}
              </div>
              <p className="text-[16px] font-medium">
                {mentor.school}
                <span className="text-[#615d59] font-normal">
                  {" "}· {t(mentor.major, mentor.major_en)} · {t(mentor.year, mentor.year_en)}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Stars rating={mentor.rating} />
                <span className="text-[14px] font-bold">{mentor.rating}</span>
                <span className="text-[14px] text-[#a39e98]">
                  · {mentor.review_count} {t(ui.reviews_label.zh, ui.reviews_label.en)}
                </span>
              </div>
            </div>
          </section>

          {/* Tagline */}
          <section className="py-6 border-t border-b border-[rgba(0,0,0,0.06)] mb-10">
            <p className="text-[18px] font-medium leading-relaxed italic text-[rgba(0,0,0,0.8)]">
              &ldquo;{t(mentor.tagline, mentor.tagline_en)}&rdquo;
            </p>
          </section>

          {/* Video */}
          {mentor.video_url && (
            <section className="mb-10">
              <h2 className="text-[22px] font-bold tracking-[-0.25px] mb-4 flex items-center gap-2">
                <Play size={18} className="text-[#0075de]" />
                {t(ui.section_video.zh, ui.section_video.en)}
              </h2>
              <div className="aspect-video rounded-[12px] overflow-hidden bg-[#f6f5f4] border border-[rgba(0,0,0,0.1)]">
                <iframe src={mentor.video_url} className="w-full h-full" allowFullScreen />
              </div>
            </section>
          )}

          {/* Story — warm white background section */}
          <section className="mb-10 -mx-6 px-6 py-10 bg-[#f6f5f4]">
            <div className="max-w-[720px]">
              <h2 className="text-[22px] font-bold tracking-[-0.25px] mb-5">
                {t(ui.section_story.zh, ui.section_story.en)}
              </h2>
              <div className="space-y-4">
                {t(mentor.story, mentor.story_en)
                  .split("\n\n")
                  .map((p, idx) => (
                    <p key={idx} className="text-[16px] leading-[1.6] text-[rgba(0,0,0,0.85)]">
                      {p}
                    </p>
                  ))}
              </div>
            </div>
          </section>

          {/* Application Results */}
          <section className="mb-10">
            <h2 className="text-[22px] font-bold tracking-[-0.25px] mb-4">
              {t(ui.section_results.zh, ui.section_results.en)}
            </h2>
            <div className="rounded-[12px] border border-[rgba(0,0,0,0.1)] overflow-hidden">
              {mentor.application_results.map((result, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    idx > 0 ? "border-t border-[rgba(0,0,0,0.06)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-medium">{result.school}</span>
                    <span className="px-2 py-0.5 rounded-[9999px] text-[11px] font-semibold bg-[#f6f5f4] text-[#a39e98] tracking-[0.125px]">
                      {result.type}
                    </span>
                  </div>
                  <ResultBadge result={result.result} />
                </div>
              ))}
            </div>
          </section>

          {/* What I Can Help With */}
          <section className="mb-10">
            <h2 className="text-[22px] font-bold tracking-[-0.25px] mb-4">
              {t(ui.section_help.zh, ui.section_help.en)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-[9999px] text-[14px] font-medium bg-[#f2f9ff] text-[#097fe8] border border-[rgba(0,117,222,0.1)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-10">
            <h2 className="text-[22px] font-bold tracking-[-0.25px] mb-5 flex items-center gap-2">
              <Star size={18} className="fill-[rgba(0,0,0,0.95)] text-[rgba(0,0,0,0.95)]" />
              {mentor.rating} · {mentor.review_count} {t(ui.reviews_label.zh, ui.reviews_label.en)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {mentor.reviews.map((review) => (
                <div key={review.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Stars rating={review.rating} />
                    <span className="text-[12px] text-[#a39e98]">{review.date}</span>
                  </div>
                  <p className="text-[14px] leading-[1.5] text-[rgba(0,0,0,0.85)] mb-2">
                    {t(review.content, review.content_en)}
                  </p>
                  <p className="text-[13px] font-semibold">
                    {t(review.author, review.author_en)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right Column — Sticky Booking ── */}
        <div className="hidden lg:block">
          <div className="sticky top-[80px]">
            <BookingSidebar mentor={mentor} onBook={() => setShowBooking(true)} />
          </div>
        </div>
      </div>

      {/* ── Mobile Fixed Bottom ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.06)] px-6 py-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[18px] font-bold">¥{mentor.services[0].price}</span>
            <span className="text-[14px] text-[#615d59]">
              {" "}/ {mentor.services[0].duration} min
            </span>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="py-2.5 px-5 bg-[#0075de] hover:bg-[#005bab] text-white text-[15px] font-semibold rounded-[4px] transition-colors"
          >
            {t(ui.booking_cta.zh, ui.booking_cta.en)}
          </button>
        </div>
      </div>

      <div className="lg:hidden h-20" />

      {showBooking && (
        <BookingModal mentor={mentor} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
