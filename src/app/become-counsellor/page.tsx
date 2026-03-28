"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, ShieldCheck, Check, Globe, BookOpen } from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "@/context/LanguageContext";

type Step = 1 | 2 | 3 | 4;

const COUNTRIES = ["China", "South Korea", "Japan", "India", "United States", "Canada", "Australia", "United Kingdom", "Singapore", "Other"];
const LANGUAGES = ["English", "Mandarin", "Korean", "Japanese", "Hindi", "Spanish", "French", "Other"];
const SESSION_TYPES = [
  { id: "quickChat",     label: "Quick Chat",    duration: "30 min", price: "$25", desc: "Q&A, school selection, quick feedback" },
  { id: "deepDive",      label: "Deep Dive",     duration: "60 min", price: "$40", desc: "Full strategy, essays, mock interviews" },
  { id: "essayPackage",  label: "Essay Package", duration: "90 min", price: "$70", desc: "Complete essay review & personal statement" },
  { id: "academic",      label: "Academic",      duration: "60 min", price: "$40", desc: "Subject tutoring — Math, Sciences, English, test prep" },
];

const ACADEMIC_SUBJECTS = [
  "Mathematics", "Chemistry", "Physics", "Biology",
  "English", "History", "Economics",
  "SAT", "ACT", "TOEFL", "IELTS", "AP Courses",
];

const SPECIALTIES = [
  "STEM Applications", "Computer Science", "Engineering", "Pre-Medicine",
  "Business & Economics", "Liberal Arts", "Architecture & Design",
  "Essay Writing", "Financial Aid", "Interview Preparation",
  "Research Experience", "International Student Transitions",
];

export default function BecomeCounsellor() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1);

  // Step 1: Basics
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Step 2: Profile
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [myStory, setMyStory] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sessionPrice, setSessionPrice] = useState(40);
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [selectedAcademicSubjects, setSelectedAcademicSubjects] = useState<string[]>([]);

  // Step 3: Verification
  const [enrollmentFile, setEnrollmentFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleSessionType = (type: string) => {
    setSelectedSessionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    // Clear subject selections when deselecting Academic
    if (type === "academic" && selectedSessionTypes.includes("academic")) {
      setSelectedAcademicSubjects([]);
    }
  };

  const toggleAcademicSubject = (subject: string) => {
    setSelectedAcademicSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const canProceedStep1 = name.trim() && email.trim() && country && selectedLanguages.length > 0;
  const academicSelected = selectedSessionTypes.includes("academic");
  const canProceedStep2 = school.trim() && major.trim() && year && myStory.trim().length >= 100 && selectedSpecialties.length >= 2 && selectedSessionTypes.length >= 1 && (!academicSelected || selectedAcademicSubjects.length >= 1);
  const canProceedStep3 = enrollmentFile != null && idFile != null;

  const steps = [
    { num: 1, label: "Basics" },
    { num: 2, label: "Your Story" },
    { num: 3, label: "Verification" },
    { num: 4, label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="font-bold text-slate-900">PathPal</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step > s.num ? "bg-emerald-500 text-white" :
                step === s.num ? "bg-slate-900 text-white" :
                "bg-slate-200 text-slate-500"
              )}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={clsx(
                "ml-2 text-sm font-medium hidden sm:block",
                step === s.num ? "text-slate-900" : "text-slate-400"
              )}>{s.label}</span>
              {idx < steps.length - 1 && (
                <div className={clsx(
                  "flex-1 h-0.5 mx-3",
                  step > s.num ? "bg-emerald-500" : "bg-slate-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Tell us the basics</h1>
            <p className="text-slate-500 text-sm mb-6">We'll use this to set up your public profile</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="As it appears on your student ID"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Preferably your .edu email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country of Origin</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Languages you speak</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                        selectedLanguages.includes(lang)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      <Globe className="w-3 h-3" />
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className={clsx(
                "mt-6 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                canProceedStep1 ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Profile + Story */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Your profile & story</h1>
            <p className="text-slate-500 text-sm mb-6">This is what students will read when deciding to book with you</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                  <input
                    type="text"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                    placeholder="e.g., Stanford University"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select</option>
                    {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> My Story
                  <span className="text-slate-400 font-normal">(min 100 characters)</span>
                </label>
                <textarea
                  value={myStory}
                  onChange={e => setMyStory(e.target.value)}
                  rows={5}
                  placeholder="Tell students about your journey from your home country to your university. What challenges did you face? What did you wish you'd known? This is the most important part of your profile — be honest and personal."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                />
                <p className={clsx("text-xs mt-1", myStory.length >= 100 ? "text-emerald-600" : "text-slate-400")}>
                  {myStory.length} / 100 minimum characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Specialties (choose at least 2)</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialty(spec)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        selectedSpecialties.includes(spec)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session types you'll offer <span className="text-slate-400 font-normal">(select at least one)</span></label>
                <div className="space-y-2">
                  {SESSION_TYPES.map(type => {
                    const selected = selectedSessionTypes.includes(type.id);
                    return (
                      <div key={type.id}>
                        <button
                          type="button"
                          onClick={() => toggleSessionType(type.id)}
                          className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                            selected
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div className={clsx(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                            selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                          )}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900">{type.label}</span>
                              <span className="text-xs text-slate-400">{type.duration}</span>
                              <span className="ml-auto text-sm font-bold text-emerald-600">{type.price}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
                          </div>
                        </button>
                        {/* Subject picker — shown only when Academic is selected */}
                        {type.id === "academic" && selected && (
                          <div className="mt-2 ml-8 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs font-medium text-slate-600 mb-2">Subjects you can teach <span className="text-slate-400 font-normal">(select all that apply)</span></p>
                            <div className="flex flex-wrap gap-1.5">
                              {ACADEMIC_SUBJECTS.map(subject => {
                                const subSelected = selectedAcademicSubjects.includes(subject);
                                return (
                                  <button
                                    key={subject}
                                    type="button"
                                    onClick={() => toggleAcademicSubject(subject)}
                                    className={clsx(
                                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                                      subSelected
                                        ? "bg-emerald-500 text-white"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
                                    )}
                                  >
                                    {subject}
                                  </button>
                                );
                              })}
                            </div>
                            {selectedAcademicSubjects.length === 0 && (
                              <p className="text-xs text-amber-600 mt-2">Select at least one subject to continue.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Starting price per 30-min session: <span className="text-emerald-600 font-bold">${sessionPrice}</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={70}
                  step={5}
                  value={sessionPrice}
                  onChange={e => setSessionPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$20</span><span>$70</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className={clsx(
                  "flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                  canProceedStep2 ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900">Verification documents</h1>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              PathPal verifies all counsellors to protect students. Your documents are reviewed within 48 hours and never shared publicly.
            </p>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-emerald-300 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-medium text-slate-700 text-sm mb-0.5">Enrollment Proof</p>
                <p className="text-xs text-slate-400 mb-3">Current semester schedule, enrollment letter, or student ID</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => setEnrollmentFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <span className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    enrollmentFile ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}>
                    {enrollmentFile ? `✓ ${enrollmentFile.name}` : "Choose File"}
                  </span>
                </label>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-emerald-300 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-medium text-slate-700 text-sm mb-0.5">Government ID</p>
                <p className="text-xs text-slate-400 mb-3">Passport, national ID, or driver's license</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => setIdFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <span className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    idFile ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}>
                    {idFile ? `✓ ${idFile.name}` : "Choose File"}
                  </span>
                </label>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                🔒 Documents are encrypted and reviewed only by PathPal staff. We never share your personal documents with students.
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                className={clsx(
                  "flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                  canProceedStep3 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Submit Application <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Application submitted!</h1>
            <p className="text-slate-600 mb-6">
              We&apos;ll review your documents and get back to you within <span className="font-semibold text-slate-900">48 hours</span>. Once verified, your profile goes live and students can start booking.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
              {[
                "You'll receive an email when your verification is complete",
                "Your profile will be visible to students immediately after approval",
                "You can start earning from $25/session",
                "PathPal handles payments — you get paid weekly",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="block w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Back to PathPal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
