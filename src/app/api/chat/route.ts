import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.DASHSCOPE_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN;
const API_MODEL = process.env.DASHSCOPE_MODEL || process.env.ANTHROPIC_MODEL || "MiniMax-M2.5";
const API_BASE_URL = process.env.DASHSCOPE_BASE_URL || process.env.ANTHROPIC_BASE_URL || "https://coding-intl.dashscope.aliyuncs.com/apps/anthropic";

const SYSTEM_PROMPT = `You are PathPal AI, a warm and encouraging college admissions advisor built into the PathPal platform. You genuinely care about helping students find the right college fit.

Your tone:
- Warm, supportive, and optimistic — like a trusted older sibling who went through the process
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

Response format:
- Keep responses to 2-3 short paragraphs (max 150 words)
- Use line breaks between paragraphs for readability
- End with a follow-up question to keep the conversation going
- When relevant, mention that PathPal has consultants who can provide deeper 1-on-1 guidance
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

/**
 * Extract the actual text content from various AI response formats.
 * Skips "thinking" blocks and finds the real text response.
 */
function extractTextContent(data: Record<string, unknown>): string | undefined {
  // Handle content array (Anthropic format, with possible thinking blocks)
  const contentArray = data.content ?? (data.role ? data.content : undefined);

  if (Array.isArray(contentArray)) {
    // Find the text block, skipping thinking/signature blocks
    for (const block of contentArray) {
      if (block.type === "text" && block.text) {
        return block.text;
      }
    }
    // Fallback: grab first block with .text that isn't a thinking block
    for (const block of contentArray) {
      if (block.text && block.type !== "thinking") {
        return block.text;
      }
    }
    // Last resort: any block with text content
    for (const block of contentArray) {
      if (typeof block.text === "string" && block.text.length > 0) {
        return block.text;
      }
      if (typeof block === "string") {
        return block;
      }
    }
  }

  // Simple string content
  if (typeof data.content === "string") {
    return data.content;
  }

  // OpenAI-compatible format
  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  if (choices?.[0]?.message?.content) {
    return choices[0].message.content;
  }

  // DashScope native format
  const output = data.output as { choices?: Array<{ message?: { content?: string } }>; text?: string } | undefined;
  if (output?.choices?.[0]?.message?.content) {
    return output.choices[0].message.content;
  }
  if (output?.text) {
    return output.text;
  }

  return undefined;
}
