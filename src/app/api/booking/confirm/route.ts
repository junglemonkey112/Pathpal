import { NextRequest, NextResponse } from "next/server";
import { generateICS, type CalendarEvent } from "@/utils/calendar";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "PathPal <onboarding@resend.dev>";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Escape HTML special characters to prevent injection in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  // Auth check: verify Supabase session from Authorization header
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await request.json();
  const {
    userEmail,
    userName,
    counsellorName,
    counsellorSchool,
    serviceName,
    serviceDuration,
    servicePrice,
    date,
    time,
    timezone,
  } = body;

  if (!userEmail || !counsellorName || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const event: CalendarEvent = {
    title: `PathPal Session with ${counsellorName}`,
    description: `Your ${serviceDuration}-minute ${serviceName} session with ${counsellorName} (${counsellorSchool}).\n\nCost: $${servicePrice}\n\nA Zoom link will be sent 30 minutes before your session.\n\nQuestions? Reply to this email.`,
    date,
    time,
    timezone,
    durationMinutes: serviceDuration,
    organizerName: counsellorName,
    attendeeEmail: userEmail,
    attendeeName: userName ?? userEmail,
  };

  const icsContent = generateICS(event);
  const icsBase64 = Buffer.from(icsContent).toString("base64");

  // If Resend is not configured, return success with the ICS content
  // so the client can still trigger the download
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: true, icsContent, warning: "Email not sent: RESEND_API_KEY not configured" });
  }

  // Escape all user-supplied values for HTML email
  const safeUserName = escapeHtml(userName ?? "there");
  const safeCounsellorName = escapeHtml(counsellorName);
  const safeServiceName = escapeHtml(serviceName);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);
  const safeTimezone = escapeHtml(timezone);
  const safeDuration = escapeHtml(String(serviceDuration));
  const safePrice = escapeHtml(String(servicePrice));

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: `Confirmed: PathPal session with ${safeCounsellorName} on ${safeDate}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1e293b;">
            <div style="background:#0f172a;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:white;margin:0;font-size:20px;">PathPal</h1>
            </div>
            <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:32px;">
              <h2 style="color:#059669;margin-top:0;">Session Confirmed!</h2>
              <p>Hi ${safeUserName},</p>
              <p>Your session with <strong>${safeCounsellorName}</strong> is booked. Here are the details:</p>
              <table style="width:100%;background:#f8fafc;border-radius:8px;padding:16px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#64748b;">Session</td><td style="padding:6px 0;font-weight:600;">${safeServiceName}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Date</td><td style="padding:6px 0;font-weight:600;">${safeDate}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Time</td><td style="padding:6px 0;font-weight:600;">${safeTime} ${safeTimezone}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Duration</td><td style="padding:6px 0;font-weight:600;">${safeDuration} minutes</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Price</td><td style="padding:6px 0;font-weight:600;">$${safePrice}</td></tr>
              </table>
              <p style="margin-top:24px;color:#64748b;font-size:14px;">
                A Zoom link will be sent 30 minutes before your session starts.<br/>
                The <strong>.ics calendar invite</strong> is attached — open it to add this to your calendar.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
              <p style="color:#94a3b8;font-size:12px;text-align:center;">PathPal - International Student Counselling</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `pathpal-session-${safeDate}.ics`,
            content: icsBase64,
            content_type: "text/calendar; method=REQUEST",
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ ok: true, icsContent, warning: "Email delivery failed" });
    }

    return NextResponse.json({ ok: true, icsContent });
  } catch (err) {
    console.error("Booking confirm error:", err);
    return NextResponse.json({ ok: true, icsContent, warning: "Email delivery failed" });
  }
}
