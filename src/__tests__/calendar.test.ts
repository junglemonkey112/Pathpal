import { describe, it, expect } from "vitest";
import { generateICS, getGoogleCalendarUrl, type CalendarEvent } from "@/utils/calendar";

const mockEvent: CalendarEvent = {
  title: "PathPal Session with Jessica Kim",
  description: "Your 30-minute Quick Chat session.",
  date: "2026-04-07",
  time: "10:00 AM",
  timezone: "KST",
  durationMinutes: 30,
  organizerName: "Jessica Kim",
  attendeeEmail: "student@example.com",
  attendeeName: "Test Student",
};

describe("generateICS", () => {
  it("produces valid iCalendar structure", () => {
    const ics = generateICS(mockEvent);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("METHOD:REQUEST");
  });

  it("includes event title and description", () => {
    const ics = generateICS(mockEvent);
    expect(ics).toContain("SUMMARY:PathPal Session with Jessica Kim");
    expect(ics).toContain("DESCRIPTION:");
  });

  it("includes attendee email", () => {
    const ics = generateICS(mockEvent);
    expect(ics).toContain("student@example.com");
  });

  it("includes 30-minute alarm", () => {
    const ics = generateICS(mockEvent);
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER:-PT30M");
  });

  it("converts KST time to UTC correctly", () => {
    const ics = generateICS(mockEvent);
    // 10:00 AM KST = 01:00 UTC
    expect(ics).toContain("DTSTART:20260407T010000Z");
  });

  it("calculates end time from duration", () => {
    const ics = generateICS(mockEvent);
    // 01:00 UTC + 30 min = 01:30 UTC
    expect(ics).toContain("DTEND:20260407T013000Z");
  });

  it("handles PM times", () => {
    const pmEvent = { ...mockEvent, time: "2:30 PM", timezone: "UTC" };
    const ics = generateICS(pmEvent);
    expect(ics).toContain("DTSTART:20260407T143000Z");
  });

  it("handles 12:00 AM correctly (midnight)", () => {
    const midnightEvent = { ...mockEvent, time: "12:00 AM", timezone: "UTC" };
    const ics = generateICS(midnightEvent);
    expect(ics).toContain("DTSTART:20260407T000000Z");
  });

  it("handles 12:00 PM correctly (noon)", () => {
    const noonEvent = { ...mockEvent, time: "12:00 PM", timezone: "UTC" };
    const ics = generateICS(noonEvent);
    expect(ics).toContain("DTSTART:20260407T120000Z");
  });
});

describe("getGoogleCalendarUrl", () => {
  it("returns a valid Google Calendar URL", () => {
    const url = getGoogleCalendarUrl(mockEvent);
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
  });

  it("includes event title in URL", () => {
    const url = getGoogleCalendarUrl(mockEvent);
    expect(url).toContain("PathPal+Session+with+Jessica+Kim");
  });

  it("includes date range in URL", () => {
    const url = getGoogleCalendarUrl(mockEvent);
    // Should contain start/end in format like 20260407T010000Z/20260407T013000Z
    expect(url).toContain("20260407T010000Z");
    expect(url).toContain("20260407T013000Z");
  });
});
