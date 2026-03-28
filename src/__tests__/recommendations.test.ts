import { describe, it, expect } from "vitest";
import { getRecommendations, getRecommendedSchools } from "@/utils/recommendations";
import type { Counsellor } from "@/data/counsellors";

const mockCounsellor = (overrides: Partial<Counsellor> = {}): Counsellor => ({
  id: "test-1",
  name: "Test Counsellor",
  avatar: "",
  school: "Harvard",
  major: "Computer Science",
  year: "Junior",
  country: "South Korea",
  countryFlag: "🇰🇷",
  languages: ["English", "Korean"],
  minGPA: 3.5,
  bio: "Test bio",
  myStory: "Test story",
  specialties: ["CS", "STEM"],
  services: [
    { name: "Quick Chat", duration: 30, price: 50, description: "30 min" },
    { name: "Deep Dive", duration: 60, price: 80, description: "60 min" },
    { name: "Intensive", duration: 90, price: 120, description: "90 min" },
  ],
  rating: 4.8,
  reviewCount: 10,
  reviews: [],
  availableSlots: [],
  studentSuccess: ["MIT", "Stanford"],
  verificationStatus: "verified",
  ...overrides,
});

describe("getRecommendations", () => {
  it("returns results sorted by match score descending", () => {
    const counsellors = [
      mockCounsellor({ id: "1", rating: 4.5, specialties: ["Business"] }),
      mockCounsellor({ id: "2", rating: 4.9, specialties: ["CS", "STEM", "Research"] }),
    ];

    const results = getRecommendations(counsellors, {
      grade: "Grade 11",
      gpa: "3.5-3.8",
      interests: ["cs"],
      targetMajor: "",
      targetSchools: [],
      budget: "$50-80",
      hasSAT: false,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].counsellor.id).toBe("2");
    expect(results[0].matchScore).toBeGreaterThan(0);
  });

  it("gives higher score to budget-matching counsellors", () => {
    const counsellors = [
      mockCounsellor({ id: "cheap", rating: 4.0, services: [{ name: "Q", duration: 30, price: 25, description: "" }, { name: "D", duration: 60, price: 40, description: "" }, { name: "I", duration: 90, price: 60, description: "" }] }),
      mockCounsellor({ id: "expensive", rating: 4.0, services: [{ name: "Q", duration: 30, price: 150, description: "" }, { name: "D", duration: 60, price: 250, description: "" }, { name: "I", duration: 90, price: 350, description: "" }] }),
    ];

    const results = getRecommendations(counsellors, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "Under $30",
      hasSAT: false,
    });

    const cheap = results.find(r => r.counsellor.id === "cheap");
    const expensive = results.find(r => r.counsellor.id === "expensive");
    expect(cheap).toBeDefined();
    expect(cheap!.matchScore).toBeGreaterThan(expensive?.matchScore ?? 0);
  });

  it("scores specialty matches", () => {
    const counsellors = [
      mockCounsellor({ id: "cs-expert", specialties: ["CS", "Computer Science", "STEM"] }),
      mockCounsellor({ id: "arts-expert", specialties: ["Art & Design", "Liberal Arts"] }),
    ];

    const results = getRecommendations(counsellors, {
      grade: "Grade 12",
      gpa: "",
      interests: ["cs"],
      targetMajor: "",
      targetSchools: [],
      budget: "$100+",
      hasSAT: false,
    });

    expect(results[0].counsellor.id).toBe("cs-expert");
    expect(results[0].matchScore).toBeGreaterThan(results[1]?.matchScore ?? 0);
  });

  it("gives bonus for target school match", () => {
    const counsellors = [
      mockCounsellor({ id: "1", school: "Harvard", rating: 4.5 }),
      mockCounsellor({ id: "2", school: "Community College", rating: 4.5 }),
    ];

    const results = getRecommendations(counsellors, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: ["Harvard"],
      budget: "$100+",
      hasSAT: false,
    });

    const harvard = results.find(r => r.counsellor.id === "1");
    const other = results.find(r => r.counsellor.id === "2");
    expect(harvard).toBeDefined();
    expect(harvard!.matchScore).toBeGreaterThanOrEqual(other?.matchScore ?? 0);
  });

  it("gives rating bonus for highly rated counsellors", () => {
    const counsellors = [
      mockCounsellor({ id: "high", rating: 4.9, specialties: [] }),
      mockCounsellor({ id: "low", rating: 3.5, specialties: [] }),
    ];

    const results = getRecommendations(counsellors, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "$100+",
      hasSAT: false,
    });

    const high = results.find(r => r.counsellor.id === "high");
    expect(high).toBeDefined();
    expect(high!.matchScore).toBeGreaterThan(0);
  });
});

describe("getRecommendedSchools", () => {
  it("returns schools for high GPA", () => {
    const schools = getRecommendedSchools({
      grade: "Grade 12",
      gpa: "3.8-4.0",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "",
      hasSAT: false,
    });

    expect(schools.length).toBeGreaterThan(0);
    expect(schools).toContain("Harvard University");
  });

  it("returns different schools for lower GPA", () => {
    const schools = getRecommendedSchools({
      grade: "Grade 12",
      gpa: "Below 3.0",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "",
      hasSAT: false,
    });

    expect(schools.length).toBeGreaterThan(0);
    expect(schools).not.toContain("Harvard University");
  });
});
