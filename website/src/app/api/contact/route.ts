import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Required fields missing (name, email, message)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!apiKey || apiKey === "your_access_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "Web3Forms Access Key is not configured in .env.local yet.",
          needsKey: true,
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: apiKey,
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim()
          ? `[Direct Transmission] ${subject.trim()}`
          : `[Direct Transmission] Inquiry from ${name.trim()}`,
        message: message.trim(),
        from_name: `${name.trim()} via Portfolio`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Transmission delivered successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: result.message || "Upstream transmission dispatch failed.",
      },
      { status: response.status || 500 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal gateway transmission error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
