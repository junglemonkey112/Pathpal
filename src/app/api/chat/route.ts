import { NextRequest, NextResponse } from "next/server";

const DASHSCOPE_BASE_URL = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_MODEL = process.env.DASHSCOPE_MODEL || "MiniMax-M2.5";

const SYSTEM_PROMPT = `You are PathPal AI, a friendly and knowledgeable college admissions advisor. You help students navigate US university applications.

Your expertise includes:
- College selection and fit assessment
- Application timelines and deadlines
- Essay writing tips and strategies
- Extracurricular activity guidance
- Standardized test preparation (SAT/ACT)
- Financial aid and scholarships
- Interview preparation
- Major/career exploration

Guidelines:
- Keep responses concise (2-4 paragraphs max)
- Be encouraging and supportive
- Give actionable advice
- When appropriate, suggest the student book a 1-on-1 session with a PathPal consultant for personalized help
- Do not make up specific statistics or acceptance rates unless commonly known
- If you don't know something, say so honestly`;

export async function POST(request: NextRequest) {
  if (!DASHSCOPE_API_KEY) {
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

    // Build messages array with system prompt as first message
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "ai" ? "assistant" : m.role,
        content: m.content,
      })),
    ];

    const response = await fetch(DASHSCOPE_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: DASHSCOPE_MODEL,
        input: {
          messages: apiMessages,
        },
        parameters: {
          result_format: "message",
          max_tokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DashScope API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // DashScope native response format
    const aiContent =
      data.output?.choices?.[0]?.message?.content ||
      data.output?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
