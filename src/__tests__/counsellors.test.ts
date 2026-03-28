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

  it("all counsellors have exactly 3 service tiers", () => {
    for (const c of counsellors) {
      expect(c.services).toHaveLength(3);
      for (const s of c.services) {
        expect(s.price).toBeGreaterThan(0);
        expect(s.duration).toBeGreaterThan(0);
        expect(s.name).toBeTruthy();
      }
    }
  });

  it("all counsellors are verified", () => {
    for (const c of counsellors) {
      expect(c.verificationStatus).toBe("verified");
    }
  });

  it("service prices are in ascending order", () => {
    for (const c of counsellors) {
      for (let i = 1; i < c.services.length; i++) {
        expect(c.services[i].price).toBeGreaterThan(c.services[i - 1].price);
      }
    }
  });
});
