import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.DASHSCOPE_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN;
const API_MODEL = process.env.DASHSCOPE_MODEL || process.env.ANTHROPIC_MODEL || "MiniMax-M2.5";
const API_BASE_URL = process.env.DASHSCOPE_BASE_URL || process.env.ANTHROPIC_BASE_URL || "https://coding-intl.dashscope.aliyuncs.com/apps/anthropic";

// Simple in-memory rate limiter: max 10 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 300_000);

const SYSTEM_PROMPT = `You are PathPal AI, a warm and encouraging college admissions advisor specializing in helping international students navigate US university applications. You genuinely care about helping students find the right college fit.

Your tone:
- Warm, supportive, and optimistic — like a trusted older sibling who went through the exact same process
- Use simple, clear language (no jargon)
- Celebrate what students have going for them before addressing gaps
- Be specific and actionable, not generic
- Be culturally sensitive — understand that students from Korea, China, Japan, India, and other countries have unique challenges

Your expertise:
- International grading system conversion (Korean 수능, Chinese 高考, Japanese 大学入試, IB, A-levels)
- Financial aid for international students — need-blind vs need-aware policies
- College selection and fit assessment for international students
- Essay tips for students from cultures that value humility (how to be authentic without bragging)
- F-1 visa process and student immigration basics
- Application strategy and timelines for international applicants
- Extracurricular positioning across different educational systems
- SAT/ACT vs national exam strategy
- Understanding ED/EA as an international student

Response format:
- Keep responses to 2-3 short paragraphs (max 150 words)
- Use line breaks between paragraphs for readability
- End with a follow-up question to keep the conversation going
- When relevant, mention that PathPal has Student Counsellors — real students who navigated this process themselves as international applicants — who can provide deeper 1-on-1 guidance
- Never fabricate statistics or acceptance rates
- If a student writes in Chinese, Korean, or Japanese, respond in that language`;

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    if (messages.length > 20) {
      return NextResponse.json(
        { error: "Conversation too long. Please start a new chat." },
        { status: 400 }
      );
    }

    const apiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.content,
    }));

    const response = await fetch(`${API_BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: API_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error: status=${response.status} body=${errorText.slice(0, 300)}`);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiContent = extractTextContent(data);

    if (!aiContent) {
      console.error("Could not parse AI response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ content: "I'm having trouble responding right now. Please try again." });
    }

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * Extract the actual text content from various AI response formats.
 * Skips "thinking" blocks and finds the real text response.
 */
function extractTextContent(data: Record<string, unknown>): string | undefined {
  const contentArray = data.content ?? (data.role ? data.content : undefined);

  if (Array.isArray(contentArray)) {
    for (const block of contentArray) {
      if (block.type === "text" && block.text) {
        return block.text;
      }
    }
    for (const block of contentArray) {
      if (block.text && block.type !== "thinking") {
        return block.text;
      }
    }
    for (const block of contentArray) {
      if (typeof block.text === "string" && block.text.length > 0) {
        return block.text;
      }
      if (typeof block === "string") {
        return block;
      }
    }
  }

  if (typeof data.content === "string") {
    return data.content;
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  if (choices?.[0]?.message?.content) {
    return choices[0].message.content;
  }

  const output = data.output as { choices?: Array<{ message?: { content?: string } }>; text?: string } | undefined;
  if (output?.choices?.[0]?.message?.content) {
    return output.choices[0].message.content;
  }
  if (output?.text) {
    return output.text;
  }

  return undefined;
}
