"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Video, Check, LogIn } from "lucide-react";
import { consultants as mockConsultants, type Consultant } from "@/data/consultants";
import { getConsultantById } from "@/lib/db/consultants";
import { clsx } from "clsx";
import { useUser } from "@/context/UserContext";

export default function ConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useUser();

  const [consultant, setConsultant] = useState<Consultant | undefined>(
    () => mockConsultants.find((c) => c.id === resolvedParams.id)
  );
  const [selectedService, setSelectedService] = useState(consultant?.services[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    getConsultantById(resolvedParams.id).then((c) => {
      if (c) {
        setConsultant(c);
        setSelectedService(c.services[0]);
      }
    }).catch(() => {});
  }, [resolvedParams.id]);

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Consultant not found</h2>
          <p className="text-text-tertiary mb-4">This consultant profile doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="text-accent-dark hover:text-accent-dark font-medium">
            ← Browse all consultants
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) {
      setShowBookingModal(true);
      setBookingStep(0); // Auth required step
      return;
    }
    setShowBookingModal(true);
    setBookingStep(1);
  };

  const handleConfirm = () => {
    setBookingStep(2);
  };

  const handleJoinCall = () => {
    window.open("https://meet.google.com/new", "_blank");
  };

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Header */}
      <header className="bg-card-bg border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-border-light rounded-lg transition-colors -ml-2">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <span className="text-lg font-bold text-text-primary">PathPal</span>
          <span className="hidden sm:inline text-text-tertiary text-sm ml-auto">Consultant Profile</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 md:px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 order-2 md:order-1">
          {/* Left Column - Info */}
          <div className="md:col-span-2 space-y-4 md:space-y-6 order-2 md:order-1">
            {/* Profile Card */}
            <div className="bg-card-bg rounded-2xl border border-border p-4 md:p-6">
              <div className="flex items-start gap-4 md:gap-6">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-border-light object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-text-primary">
                    {consultant.name}
                  </h1>
                  <p className="text-base text-text-secondary mt-0.5">
                    {consultant.school}
                  </p>
                  <p className="text-sm text-text-tertiary">
                    {consultant.major} · GPA {consultant.gpa}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{consultant.rating}</span>
                    <span className="text-text-tertiary text-xs">({consultant.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 md:mt-6 pt-4 md:pt-6 border-t border-border-light">
                <h2 className="font-semibold text-text-primary mb-2 md:mb-3">About Me</h2>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed">{consultant.bio}</p>
              </div>

              <div className="mt-5 md:mt-6">
                <h2 className="font-semibold text-text-primary mb-2 md:mb-3">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {consultant.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1.5 bg-accent-bg text-accent-dark rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {consultant.studentSuccess.length > 0 && (
                <div className="mt-5 md:mt-6">
                  <h2 className="font-semibold text-text-primary mb-2 md:mb-3">Students Accepted To</h2>
                  <div className="flex flex-wrap gap-2">
                    {consultant.studentSuccess.map((school) => (
                      <span key={school} className="px-3 py-1.5 bg-success-bg text-success rounded-full text-sm font-medium">
                        {school}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-card-bg rounded-2xl border border-border p-4 md:p-6">
              <h2 className="font-semibold text-text-primary mb-4">Reviews ({consultant.reviewCount})</h2>
              {consultant.reviews.length > 0 ? (
                <div className="space-y-4">
                  {consultant.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border-light pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary text-sm">{review.author}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={clsx(
                                  "w-3.5 h-3.5",
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-text-tertiary"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-text-tertiary text-xs">{review.date}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-tertiary">No reviews yet</p>
                  <p className="text-text-tertiary text-sm mt-1">Be the first to leave a review</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-4 md:space-y-6 order-1 md:order-2">
            <div className="bg-card-bg rounded-2xl border border-border p-4 md:p-6 sticky top-20">
              <h2 className="font-semibold text-text-primary mb-4">Services</h2>
              <div className="space-y-3">
                {consultant.services.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedService(service)}
                    className={clsx(
                      "w-full p-3 md:p-4 rounded-xl border-2 text-left transition-all",
                      selectedService?.duration === service.duration
                        ? "border-accent bg-accent-bg shadow-sm"
                        : "border-border-light hover:border-border bg-card-bg"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-text-primary">{service.duration} min Session</span>
                        <p className="text-text-tertiary text-xs md:text-sm">Admissions guidance</p>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-accent-dark">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Calendar */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-text-tertiary" />
                  <h3 className="font-medium text-text-primary text-sm">Available Slots</h3>
                </div>

                {consultant.availableSlots.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {consultant.availableSlots.slice(0, 5).map((slot) => (
                      <div key={slot.date}>
                        <p className="text-xs font-medium text-text-secondary mb-2">
                          {new Date(slot.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {slot.times.map((time) => (
                            <button
                              key={time}
                              onClick={() => {
                                setSelectedDate(slot.date);
                                setSelectedTime(time);
                              }}
                              className={clsx(
                                "px-2.5 py-1.5 rounded-lg text-xs md:text-sm transition-all",
                                selectedDate === slot.date && selectedTime === time
                                  ? "bg-accent text-white shadow-sm"
                                  : "bg-border-light text-text-secondary hover:bg-border"
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-tertiary text-sm">No available slots</p>
                )}

                {selectedService && selectedDate && selectedTime && (
                  <button
                    onClick={handleBooking}
                    className="w-full mt-5 md:mt-6 bg-accent text-white py-3 md:py-3.5 rounded-xl hover:bg-accent-dark transition-colors font-semibold shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    {user ? "Book Now" : "Sign in to Book"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-2xl max-w-sm w-full p-5 md:p-6 mx-4">
            {/* Auth required step */}
            {bookingStep === 0 && (
              <div className="text-center">
                <div className="w-14 h-14 bg-accent-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7 text-accent-dark" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Sign in to book</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Create a free account to book sessions with {consultant.name}.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="flex-1 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark font-medium text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 py-3 border border-border rounded-xl text-text-secondary hover:bg-page-bg font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="mt-3 text-sm text-text-tertiary hover:text-text-secondary"
                >
                  Cancel
                </button>
              </div>
            )}

            {bookingStep === 1 && (
              <>
                <h3 className="text-lg font-bold text-text-primary mb-4">Confirm Booking</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Consultant</span>
                    <span className="font-medium text-text-primary">{consultant.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Service</span>
                    <span className="font-medium text-text-primary">{selectedService?.duration} min Session</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Date & Time</span>
                    <span className="font-medium text-text-primary">
                      {selectedDate && new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-text-secondary">Total</span>
                    <span className="text-2xl font-bold text-accent-dark">${selectedService?.price}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 border border-border rounded-xl text-text-secondary hover:bg-page-bg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark font-medium shadow-lg"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </>
            )}

            {bookingStep === 2 && (
              <div className="text-center">
                <div className="w-14 h-14 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Booking Confirmed!</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Your session with {consultant.name} has been booked. You&apos;ll receive a confirmation email shortly.
                </p>
                <button
                  onClick={handleJoinCall}
                  className="w-full py-3 bg-accent text-white rounded-xl hover:bg-accent-dark flex items-center justify-center gap-2 font-medium shadow-lg mb-3"
                >
                  <Video className="w-5 h-5" />
                  Join Video Call
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full py-3 border border-border rounded-xl text-text-secondary hover:bg-page-bg font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
