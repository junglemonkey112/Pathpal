import { describe, it, expect } from "vitest";
import { getRecommendations, getRecommendedSchools } from "@/utils/recommendations";
import type { Consultant } from "@/data/consultants";

const mockConsultant = (overrides: Partial<Consultant> = {}): Consultant => ({
  id: "test-1",
  name: "Test Consultant",
  avatar: "",
  school: "Harvard",
  major: "Computer Science",
  gpa: "3.9",
  minGPA: 3.5,
  bio: "Test bio",
  specialties: ["CS", "STEM"],
  services: [
    { duration: 30, price: 50 },
    { duration: 60, price: 80 },
  ],
  rating: 4.8,
  reviewCount: 10,
  reviews: [],
  availableSlots: [],
  studentSuccess: ["MIT", "Stanford"],
  year: "Junior",
  ...overrides,
});

describe("getRecommendations", () => {
  it("returns results sorted by match score descending", () => {
    const consultants = [
      mockConsultant({ id: "1", rating: 4.5, specialties: ["Business"] }),
      mockConsultant({ id: "2", rating: 4.9, specialties: ["CS", "STEM", "Research"] }),
    ];

    const results = getRecommendations(consultants, {
      grade: "Grade 11",
      gpa: "3.5-3.8",
      interests: ["cs"],
      targetMajor: "",
      targetSchools: [],
      budget: "$50-80",
      hasSAT: false,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].consultant.id).toBe("2");
    expect(results[0].matchScore).toBeGreaterThan(0);
  });

  it("gives higher score to budget-matching consultants", () => {
    const consultants = [
      mockConsultant({ id: "cheap", rating: 4.0, services: [{ duration: 30, price: 25 }, { duration: 60, price: 40 }] }),
      mockConsultant({ id: "expensive", rating: 4.0, services: [{ duration: 30, price: 150 }, { duration: 60, price: 250 }] }),
    ];

    const results = getRecommendations(consultants, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "Under $30",
      hasSAT: false,
    });

    const cheap = results.find(r => r.consultant.id === "cheap");
    const expensive = results.find(r => r.consultant.id === "expensive");
    expect(cheap).toBeDefined();
    expect(cheap!.matchScore).toBeGreaterThan(expensive?.matchScore ?? 0);
  });

  it("scores specialty matches", () => {
    const consultants = [
      mockConsultant({ id: "cs-expert", specialties: ["CS", "Computer Science", "STEM"] }),
      mockConsultant({ id: "arts-expert", specialties: ["Art & Design", "Liberal Arts"] }),
    ];

    const results = getRecommendations(consultants, {
      grade: "Grade 12",
      gpa: "",
      interests: ["cs"],
      targetMajor: "",
      targetSchools: [],
      budget: "$100+",
      hasSAT: false,
    });

    expect(results[0].consultant.id).toBe("cs-expert");
    expect(results[0].matchScore).toBeGreaterThan(results[1]?.matchScore ?? 0);
  });

  it("gives bonus for target school match", () => {
    const consultants = [
      mockConsultant({ id: "1", school: "Harvard", rating: 4.5 }),
      mockConsultant({ id: "2", school: "Community College", rating: 4.5 }),
    ];

    const results = getRecommendations(consultants, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: ["Harvard"],
      budget: "$100+",
      hasSAT: false,
    });

    const harvard = results.find(r => r.consultant.id === "1");
    const other = results.find(r => r.consultant.id === "2");
    expect(harvard).toBeDefined();
    expect(harvard!.matchScore).toBeGreaterThanOrEqual(other?.matchScore ?? 0);
  });

  it("gives rating bonus for highly rated consultants", () => {
    const consultants = [
      mockConsultant({ id: "high", rating: 4.9, specialties: [] }),
      mockConsultant({ id: "low", rating: 3.5, specialties: [] }),
    ];

    const results = getRecommendations(consultants, {
      grade: "Grade 11",
      gpa: "",
      interests: [],
      targetMajor: "",
      targetSchools: [],
      budget: "$100+",
      hasSAT: false,
    });

    const high = results.find(r => r.consultant.id === "high");
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
