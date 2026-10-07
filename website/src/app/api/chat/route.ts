import { NextRequest, NextResponse } from "next/server";
import { CHATBOT_SYSTEM_PROMPT } from "@/data/chatboxdata";

export const runtime = "nodejs";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. Messages array expected." },
        { status: 400 }
      );
    }

    // Keep the last 10 messages for context efficiency
    const sanitizedHistory = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 1500),
    }));

    const groqPayload = {
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...sanitizedHistory,
      ],
      temperature: 0.6,
      max_tokens: 1024,
    };

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groqPayload),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[Groq Chat Error]:", errText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content || "Hey there! I didn't catch that, could you rephrase?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[Chat API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong while connecting with Kiran's AI." },
      { status: 500 }
    );
  }
}
