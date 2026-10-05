import { NextResponse } from "next/server";
import {
  checkEmailSyntaxAndDisposable,
  verifyEmailDomainMx,
  verifyMailboxWithAbstractApi,
} from "@/lib/emailValidation";

// 24-hour server-side cache to protect monthly AbstractAPI quota from duplicate requests
const verificationCache = new Map<
  string,
  {
    result: {
      valid: boolean;
      status: "valid" | "invalid_syntax" | "disposable" | "invalid_domain" | "typo";
      message: string;
      suggestion?: string;
    };
    cachedAt: number;
  }
>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          valid: false,
          status: "invalid_syntax",
          message: "Email address required.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // -------------------------------------------------------------
    // GATE 1: Zero-cost local checks (Syntax, Typo, Disposable, Gibberish)
    // Runs instantly (0ms, 0 API calls). Catches typos before any cache.
    // -------------------------------------------------------------
    const initialCheck = checkEmailSyntaxAndDisposable(cleanEmail);
    if (initialCheck) {
      return NextResponse.json(initialCheck);
    }

    // 0. Cache hit check for passed checks (Consumes 0 AbstractAPI requests)
    const cached = verificationCache.get(cleanEmail);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return NextResponse.json(cached.result);
    }

    // -------------------------------------------------------------
    // GATE 2: Free DNS MX lookup (Verifies Domain Host Mail Server)
    // Stops nonexistent hosts & domains with no email servers. AbstractAPI is NEVER touched.
    // -------------------------------------------------------------
    const domain = cleanEmail.split("@")[1];
    const hasMx = await verifyEmailDomainMx(domain);

    if (!hasMx) {
      const errorResult = {
        valid: false,
        status: "invalid_domain" as const,
        message: `Host "@${domain}" does not exist or cannot receive mail.`,
      };
      verificationCache.set(cleanEmail, { result: errorResult, cachedAt: Date.now() });
      return NextResponse.json(errorResult);
    }

    // -------------------------------------------------------------
    // GATE 3: FINAL CHECK ONLY - AbstractAPI Mailbox Verification
    // STRICT RULE: Only triggered IF Gate 1 AND Gate 2 PASSED 100%
    // -------------------------------------------------------------
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      const mailbox = await verifyMailboxWithAbstractApi(cleanEmail, apiKey.trim());
      if (mailbox.checked && !mailbox.deliverable) {
        const errorResult = {
          valid: false,
          status: "invalid_domain" as const,
          message: mailbox.message || "Mailbox does not exist or cannot receive mail.",
          suggestion: mailbox.suggestion,
        };
        verificationCache.set(cleanEmail, { result: errorResult, cachedAt: Date.now() });
        return NextResponse.json(errorResult);
      }
    }

    const successResult = {
      valid: true,
      status: "valid" as const,
      message: "Mailbox verified & active.",
    };
    verificationCache.set(cleanEmail, { result: successResult, cachedAt: Date.now() });

    return NextResponse.json(successResult);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json(
      { valid: true, status: "valid", message: msg },
      { status: 200 }
    );
  }
}
