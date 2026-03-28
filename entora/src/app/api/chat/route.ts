import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.DASHSCOPE_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN;
const API_MODEL = process.env.DASHSCOPE_MODEL || process.env.ANTHROPIC_MODEL || "MiniMax-M2.5";
const API_BASE_URL = process.env.DASHSCOPE_BASE_URL || process.env.ANTHROPIC_BASE_URL || "https://coding-intl.dashscope.aliyuncs.com/apps/anthropic";

const SYSTEM_PROMPT = `You are Entora AI, a warm and encouraging college admissions advisor built into the Entora platform. You genuinely care about helping students find the right college fit.

Your tone:
- Warm, supportive, and optimistic \u2014 like a trusted older sibling who went through the process
- Use simple, clear language (no jargon)
- Celebrate what students have going for them before addressing gaps
- Be specific and actionable, not generic

Your expertise:
- College selection and fit assessment
- Application strategy and timelines
- Essay brainstorming and tips
- Extracurricular positioning
- SAT/ACT guidance
- Financial aid basics
- Interview prep
- International student admissions (US, UK, India, Nigeria)

Response format:
- Keep responses to 2-3 short paragraphs (max 150 words)
- Use line breaks between paragraphs for readability
- End with a follow-up question to keep the conversation going
- When relevant, mention that Entora has guides who can provide deeper 1-on-1 guidance
- Never fabricate statistics or acceptance rates`;

export async function POST(request: NextRequest) {
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
