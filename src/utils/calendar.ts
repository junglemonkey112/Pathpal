/**
 * Calendar invite utilities.
 * - generateICS: creates an .ics file string (iCalendar RFC 5545)
 * - getGoogleCalendarUrl: builds a one-click Google Calendar link
 * - downloadICS: triggers browser download of the .ics file
 */

export interface CalendarEvent {
  title: string;
  description: string;
  date: string;       // "2026-04-07"
  time: string;       // "10:00 AM"
  timezone: string;   // "KST"
  durationMinutes: number;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

// UTC offset (hours) for common timezone abbreviations
const TZ_OFFSETS: Record<string, number> = {
  KST: 9, JST: 9,
  CST: 8, HKT: 8, SGT: 8, // Asia
  IST: 5.5,                 // India
  PST: -8, PDT: -7,
  MST: -7, MDT: -6,
  CST_US: -6, CDT: -5,     // US Central (disambiguated)
  EST: -5, EDT: -4,
  UTC: 0, GMT: 0,
};

function parseTime12h(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return { hours: 9, minutes: 0 };
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "AM" && hours === 12) hours = 0;
  if (meridiem === "PM" && hours !== 12) hours += 12;
  return { hours, minutes };
}

function toUTCDate(event: CalendarEvent): { start: Date; end: Date } {
  const offsetHours = TZ_OFFSETS[event.timezone] ?? 0;
  const { hours, minutes } = parseTime12h(event.time);
  const [year, month, day] = event.date.split("-").map(Number);

  const startUTC = new Date(Date.UTC(year, month - 1, day, hours - offsetHours, minutes));
  const endUTC = new Date(startUTC.getTime() + event.durationMinutes * 60 * 1000);
  return { start: startUTC, end: endUTC };
}

function formatICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICS(event: CalendarEvent): string {
  const { start, end } = toUTCDate(event);
  const uid = `pathpal-${Date.now()}-${Math.random().toString(36).slice(2)}@pathpal.app`;
  const now = formatICSDate(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PathPal//Session Booking//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    "LOCATION:Zoom Video Call (link sent separately)",
    `ORGANIZER;CN=PathPal:mailto:sessions@pathpal.app`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${event.attendeeName}:mailto:${event.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:PathPal session starts in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = toUTCDate(event);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description,
    location: "Zoom Video Call (link sent separately)",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICS(icsContent: string, filename = "pathpal-session.ics"): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
