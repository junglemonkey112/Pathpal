"use client";

import { useState } from "react";
import { X, ChevronRight, Check, GraduationCap, Target, School, DollarSign } from "lucide-react";
import { useUser, UserProfile } from "@/context/UserContext";
import { clsx } from "clsx";

const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const gpaRanges = ["Below 3.0", "3.0-3.5", "3.5-3.8", "3.8-4.0", "4.0+"];
const interests = [
  { id: "cs", label: "Computer Science", icon: "💻" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "engineering", label: "Engineering", icon: "⚙️" },
  { id: "arts", label: "Arts & Design", icon: "🎨" },
  { id: "science", label: "Natural Sciences", icon: "🔬" },
  { id: "social", label: "Social Sciences", icon: "🌍" },
  { id: "medicine", label: "Pre-Med", icon: "🏥" },
  { id: "law", label: "Law", icon: "⚖️" },
];
const majors = [
  "Computer Science (CS)",
  "Business Analytics",
  "Electrical Engineering (EE)",
  "Economics",
  "Psychology",
  "Biology",
  "Art & Design",
  "Political Science",
  "Mechanical Engineering",
  "Data Science",
];
const schools = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "University of Pennsylvania",
  "Cornell University",
  "Duke University",
  "Northwestern University",
  "UC Berkeley",
  "UCLA",
  "Carnegie Mellon University",
  "University of Chicago",
  "Brown University",
];
const budgets = ["Under $30", "$30-50", "$50-80", "$80-100", "$100+"];

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, setProfile, setIsOnboarded } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    grade: "",
    gpa: "",
    interests: [],
    targetMajor: "",
    targetSchools: [],
    budget: "",
    hasSAT: false,
    satScore: "",
  });

  const totalSteps = 4;

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleSchoolToggle = (school: string) => {
    setFormData((prev) => ({
      ...prev,
      targetSchools: prev.targetSchools.includes(school)
        ? prev.targetSchools.filter((s) => s !== school)
        : [...prev.targetSchools, school].slice(0, 5),
    }));
  };

  const handleSubmit = () => {
    // Save profile to localStorage for persistence
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setProfile(formData);
    setIsOnboarded(true);
    setShowOnboarding(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.grade && formData.gpa;
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.targetMajor && formData.targetSchools.length > 0;
      case 4:
        return formData.budget;
      default:
        return true;
    }
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tell Us About You</h2>
            <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Grade & GPA</h3>
                <p className="text-sm text-gray-500">Help us understand your background</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Grade</label>
                <div className="grid grid-cols-4 gap-2">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setFormData((prev) => ({ ...prev, grade }))}
                      className={clsx(
                        "py-3 rounded-xl text-sm font-medium transition-all",
                        formData.grade === grade
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA (out of 4.0)</label>
                <div className="grid grid-cols-3 gap-2">
                  {gpaRanges.map((gpa) => (
                    <button
                      key={gpa}
                      onClick={() => setFormData((prev) => ({ ...prev, gpa }))}
                      className={clsx(
                        "py-2.5 rounded-xl text-sm font-medium transition-all",
                        formData.gpa === gpa
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {gpa}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Interests</h3>
                <p className="text-sm text-gray-500">Select areas that interest you (multiple allowed)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={clsx(
                      "p-4 rounded-xl text-left transition-all flex items-center gap-3",
                      formData.interests.includes(interest.id)
                        ? "bg-indigo-50 border-2 border-indigo-600"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    )}
                  >
                    <span className="text-2xl">{interest.icon}</span>
                    <span className="font-medium text-gray-900">{interest.label}</span>
                    {formData.interests.includes(interest.id) && (
                      <Check className="w-5 h-5 text-indigo-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Target Schools & Major */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <School className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Target Schools</h3>
                <p className="text-sm text-gray-500">Select your dream schools and major</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Major</label>
                <select
                  value={formData.targetMajor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, targetMajor: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a major...</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Schools (select 1-5)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  {schools.map((school) => (
                    <button
                      key={school}
                      onClick={() => handleSchoolToggle(school)}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm transition-all",
                        formData.targetSchools.includes(school)
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      )}
                    >
                      {school.replace(" University", "").replace(" of ", " ")}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.targetSchools.length} schools selected
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Budget</h3>
                <p className="text-sm text-gray-500">Hourly rate you can afford</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {budgets.map((budget) => (
                  <button
                    key={budget}
                    onClick={() => setFormData((prev) => ({ ...prev, budget }))}
                    className={clsx(
                      "py-4 rounded-xl text-sm font-medium transition-all",
                      formData.budget === budget
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {budget}
                  </button>
                ))}
              </div>

              <div className="bg-indigo-50 rounded-2xl p-4 mt-6">
                <h4 className="font-semibold text-indigo-900 mb-2">You&apos;re All Set!</h4>
                <p className="text-sm text-indigo-700">
                  We&apos;ll match you with the best consultants based on your profile.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 rounded-b-3xl flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
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
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={clsx(
                "flex-1 py-3 rounded-xl font-medium",
                canProceed()
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Find My Consultants
            </button>
          )}
        </div>
      </div>
    </div>
  );
}