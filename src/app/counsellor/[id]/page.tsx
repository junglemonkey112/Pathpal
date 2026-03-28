"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Globe, Calendar, Video, Check, LogIn, BookOpen, Trophy, Download } from "lucide-react";
import { counsellors } from "@/data/counsellors";
import { clsx } from "clsx";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { generateICS, getGoogleCalendarUrl, downloadICS, type CalendarEvent } from "@/utils/calendar";
import Navbar from "@/components/Navbar";

export default function CounsellorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const { t } = useLanguage();

  const counsellor = counsellors.find((c) => c.id === id);

  const [selectedService, setSelectedService] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState("");
  const [icsContent, setIcsContent] = useState("");

  if (!counsellor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Counsellor not found</h1>
          <Link href="/" className="text-emerald-600 hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      setShowAuthPrompt(true);
    } else if (selectedSlot) {
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = async () => {
    setShowBookingModal(false);

    const slot = counsellor.availableSlots.find(
      (s) => `${s.date}-${s.time}` === selectedSlot
    );
    if (!slot) { setBookingConfirmed(true); return; }

    const service = counsellor.services[selectedService];
    const calEvent: CalendarEvent = {
      title: `PathPal Session with ${counsellor.name}`,
      description: `Your ${service.duration}-minute ${service.name} session with ${counsellor.name} (${counsellor.school}).\n\nA Zoom link will be sent 30 minutes before your session.`,
      date: slot.date,
      time: slot.time,
      timezone: slot.timezone,
      durationMinutes: service.duration,
      organizerName: counsellor.name,
      attendeeEmail: user?.email ?? "",
      attendeeName: user?.user_metadata?.full_name ?? user?.email ?? "Student",
    };

    // Build Google Calendar URL
    setGoogleCalendarUrl(getGoogleCalendarUrl(calEvent));

    // Auto-download .ics
    const ics = generateICS(calEvent);
    setIcsContent(ics);
    downloadICS(ics, `pathpal-${counsellor.name.toLowerCase().replace(/\s+/g, "-")}-${slot.date}.ics`);

    // Send confirmation email (non-blocking)
    if (user?.email) {
      fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.user_metadata?.full_name ?? user.email,
          counsellorName: counsellor.name,
          counsellorSchool: counsellor.school,
          serviceName: service.name,
          serviceDuration: service.duration,
          servicePrice: service.price,
          date: slot.date,
          time: slot.time,
          timezone: slot.timezone,
        }),
      }).catch(() => {/* silent fail */});
    }

    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Profile */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex gap-5">
                <div className="relative flex-shrink-0">
                  <img
                    src={counsellor.avatar}
                    alt={counsellor.name}
                    className="w-24 h-24 rounded-2xl bg-slate-100 object-cover"
                  />
                  {counsellor.verificationStatus === "verified" && (
                    <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 rounded-full p-1">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{counsellor.name}</h1>
                    <span className="text-xl">{counsellor.countryFlag}</span>
                    {counsellor.verificationStatus === "verified" && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                        {t("counsellor.verifiedTitle")}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 font-semibold">{counsellor.school}</p>
                  <p className="text-slate-500">{counsellor.major} · {counsellor.year}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-slate-900">{counsellor.rating}</span>
                      <span className="text-slate-500 text-sm">({counsellor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>{counsellor.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Story */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">{t("counsellor.myStory")}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{counsellor.myStory}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t("counsellor.specialties")}</h2>
              <div className="flex flex-wrap gap-2">
                {counsellor.specialties.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Student Success */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">{t("counsellor.studentSuccess")}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {counsellor.studentSuccess.map((school) => (
                  <span key={school} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-full font-medium">
                    {school}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {counsellor.reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full bg-slate-200" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{review.author}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t("counsellor.bookSession")}</h2>

              {bookingConfirmed ? (
                <div className="py-4">
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">Booking Confirmed!</p>
                    <p className="text-sm text-slate-500">
                      {user?.email ? `Confirmation email sent to ${user.email}` : "Your session is booked."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {googleCalendarUrl && (
                      <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Add to Google Calendar
                      </a>
                    )}
                    {icsContent && (
                      <button
                        onClick={() => downloadICS(icsContent)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download .ics (Apple / Outlook)
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Services */}
                  <div className="space-y-2 mb-5">
                    {counsellor.services.map((service, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedService(idx)}
                        className={clsx(
                          "w-full text-left p-3 rounded-xl border-2 transition-all",
                          selectedService === idx
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900 text-sm">{service.name}</span>
                          <span className="text-emerald-600 font-bold">${service.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{service.duration} min · {service.description}</p>
                      </button>
                    ))}
                  </div>

                  {/* Available slots */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Available Times
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {counsellor.availableSlots.map((slot, idx) => {
                        const slotKey = `${slot.date}-${slot.time}`;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedSlot(slotKey)}
                            className={clsx(
                              "p-2 rounded-lg border text-xs transition-all",
                              selectedSlot === slotKey
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 text-slate-600 hover:border-slate-300"
                            )}
                          >
                            <div className="font-medium">{slot.date.slice(5)}</div>
                            <div>{slot.time}</div>
                            <div className="text-slate-400">{slot.timezone}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    disabled={!selectedSlot}
                    className={clsx(
                      "w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
                      selectedSlot
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <Video className="w-4 h-4" />
                    {t("counsellor.bookSession")} · ${counsellor.services[selectedService].price}
                  </button>

                  {!user && (
                    <p className="text-xs text-slate-500 text-center mt-2">
                      You&apos;ll be prompted to sign in
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth prompt modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <LogIn className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">Sign in to book</h3>
              <p className="text-slate-500 text-sm mt-1">Create a free account to book sessions with {counsellor.name}</p>
            </div>
            <div className="space-y-2">
              <Link href="/signup" className="block w-full bg-slate-900 text-white text-center py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors">
                Create Free Account
              </Link>
              <Link href="/login" className="block w-full text-center py-2.5 text-slate-600 text-sm hover:text-slate-900">
                Already have an account? Sign in
              </Link>
            </div>
            <button onClick={() => setShowAuthPrompt(false)} className="mt-3 w-full text-center text-slate-400 text-xs hover:text-slate-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Booking confirmation modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Booking</h3>
            <p className="text-slate-500 text-sm mb-4">
              {counsellor.services[selectedService].name} with {counsellor.name} · {selectedSlot?.replace("-", " at ").replace(/-/g, "/")}
            </p>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-4">
              <span className="text-slate-700 font-medium">{counsellor.services[selectedService].duration} min session</span>
              <span className="text-xl font-bold text-slate-900">${counsellor.services[selectedService].price}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"
              >
                Confirm &amp; Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
