"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ChevronRight, Check, User, Briefcase, Globe, Clock, DollarSign, MessageSquare, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

// Role options
const roles = [
  { id: "counselor", label: "Professional Counselor", desc: "Certified college admissions counselor" },
  { id: "peer", label: "Near Peer Mentor", desc: "Current college student or alumni" },
];

// Service options
const services = [
  "College Preparatory Counseling",
  "College Application Strategy",
  "Essay Editing",
  "Course Planning",
  "GPA Improvement",
  "Homework Support",
  "Standardized Test Prep",
  "STEM Research Guidance",
];

// Hourly rates
const hourlyRates = [30, 50, 70, 80, 100, 120, 150, 200];

// US Cities
const usCities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
  "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington DC",
  "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City",
  "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Atlanta", "Miami", "Cleveland", "Omaha", "Minneapolis"
];

// Time slots
const timeSlots = [
  { id: "weekday-morning", label: "Weekday Morning (9am-12pm)" },
  { id: "weekday-afternoon", label: "Weekday Afternoon (12pm-5pm)" },
  { id: "weekday-evening", label: "Weekday Evening (5pm-9pm)" },
  { id: "weekend-morning", label: "Weekend Morning (9am-12pm)" },
  { id: "weekend-afternoon", label: "Weekend Afternoon (12pm-5pm)" },
  { id: "weekend-evening", label: "Weekend Evening (5pm-9pm)" },
];

export default function BecomeConsultant() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    preferredName: "",
    email: "",
    phone: "",
    company: "",
    school: "",
    highSchool: "",
    country: "",
    city: "",
    hourlyRate: 50,
    bio: "",
    services: [] as string[],
    availability: [] as string[],
  });

  const totalSteps = 3;

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleAvailability = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot]
    }));
  };

  const canProceed = () => {
    switch(step) {
      case 1:
        return formData.role;
      case 2:
        return formData.fullName && formData.hourlyRate && 
               formData.city &&
               ((formData.role === "counselor" && formData.company) || 
                (formData.role === "peer" && formData.school));
      case 3:
        return formData.services.length > 0 && formData.availability.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    // Save to localStorage for demo
    localStorage.setItem("consultantProfile", JSON.stringify(formData));
    alert("Profile submitted successfully! We'll review and get back to you.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {step} of {totalSteps}</span>
            <span className="text-sm text-slate-500">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Role</h1>
              <p className="text-slate-600">Select how you'd like to help students</p>
            </div>

            <div className="space-y-3">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  className={clsx(
                    "w-full p-4 rounded-2xl border-2 text-left transition-all",
                    formData.role === role.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      formData.role === role.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{role.label}</div>
                      <div className="text-sm text-slate-500">{role.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h1>
              <p className="text-slate-600">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Name</label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {formData.role === "counselor" ? "Company / Organization *" : "Current School *"}
                </label>
                <input
                  type="text"
                  value={formData.role === "counselor" ? formData.company : formData.school}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    [formData.role === "counselor" ? "company" : "school"]: e.target.value 
                  }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={formData.role === "counselor" ? "ABC Admissions LLC" : "Harvard University"}
                />
              </div>

              {formData.role === "peer" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">High School Attended</label>
                  <input
                    type="text"
                    value={formData.highSchool}
                    onChange={(e) => setFormData(prev => ({ ...prev, highSchool: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Shanghai American School"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                  <select
                    value={formData.country || "USA"}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="USA">United States</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select city...</option>
                    {usCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate *</label>
                <div className="flex flex-wrap gap-2">
                  {hourlyRates.map(rate => (
                    <button
                      key={rate}
                      onClick={() => setFormData(prev => ({ ...prev, hourlyRate: rate }))}
                      className={clsx(
                        "px-4 py-2 rounded-lg font-medium transition-all",
                        formData.hourlyRate === rate
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      )}
                    >
                      ${rate}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">One-line Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={2}
                  placeholder="Harvard junior, helped 20+ students get into top schools..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services & Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Services & Availability</h1>
              <p className="text-slate-600">What can you help with?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Services Offered *</label>
              <div className="grid grid-cols-2 gap-2">
                {services.map(service => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={clsx(
                      "p-3 rounded-xl text-sm text-left transition-all",
                      formData.services.includes(service)
                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700"
                        : "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {formData.services.includes(service) && <Check className="w-4 h-4 inline mr-1" />}
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Availability *</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => toggleAvailability(slot.id)}
                    className={clsx(
                      "p-3 rounded-xl text-sm text-left transition-all flex items-center gap-2",
                      formData.availability.includes(slot.id)
                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700"
                        : "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
            >
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={clsx(
                "flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                canProceed()
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={clsx(
                "flex-1 py-3 rounded-xl font-medium",
                canProceed()
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              Submit Application
            </button>
          )}
        </div>
      </main>
    </div>
  );
}