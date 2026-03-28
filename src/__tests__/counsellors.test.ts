import { describe, it, expect } from "vitest";
import { counsellors, type Counsellor } from "@/data/counsellors";

describe("counsellors data integrity", () => {
  it("has exactly 8 counsellors", () => {
    expect(counsellors).toHaveLength(8);
  });

  it("all counsellors have unique IDs", () => {
    const ids = counsellors.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all counsellors have required fields", () => {
    for (const c of counsellors) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.school).toBeTruthy();
      expect(c.major).toBeTruthy();
      expect(c.country).toBeTruthy();
      expect(c.languages.length).toBeGreaterThan(0);
      expect(c.bio).toBeTruthy();
      expect(c.myStory).toBeTruthy();
      expect(c.rating).toBeGreaterThanOrEqual(0);
      expect(c.rating).toBeLessThanOrEqual(5);
    }
  });

  it("all counsellors have at least 3 service tiers with valid fields", () => {
    for (const c of counsellors) {
      expect(c.services.length).toBeGreaterThanOrEqual(3);
      for (const s of c.services) {
        expect(s.price).toBeGreaterThan(0);
        expect(s.duration).toBeGreaterThan(0);
        expect(s.name).toBeTruthy();
        // Academic tiers must specify at least one subject
        if (s.name === "Academic") {
          expect(s.subjects?.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("all counsellors are verified", () => {
    for (const c of counsellors) {
      expect(c.verificationStatus).toBe("verified");
    }
  });

  it("non-Academic service prices are in ascending order", () => {
    for (const c of counsellors) {
      const admissionServices = c.services.filter(s => s.name !== "Academic");
      for (let i = 1; i < admissionServices.length; i++) {
        expect(admissionServices[i].price).toBeGreaterThan(admissionServices[i - 1].price);
      }
    }
  });
});
