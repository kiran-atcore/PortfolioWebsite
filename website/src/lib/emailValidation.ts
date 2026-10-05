import dns from "node:dns/promises";

// Popular disposable / temporary email domains to prevent spam and throwaway submissions
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamailblock.com",
  "mailinator.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "trashmail.me",
  "getnada.com",
  "dispostable.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "maildrop.cc",
  "sharklasers.com",
  "spam4.me",
  "grr.la",
  "tempinbox.com",
  "burnermail.io",
  "dropmail.me",
  "crazymailing.com",
  "mohmal.com",
  "mailnesia.com",
  "emailondeck.com",
  "tmail.ws",
  "minuteinbox.com",
  "generator.email",
  "fakemailgenerator.com",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "einrot.com",
  "fckmail.com",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "tempail.com",
]);

// Common typos on major email providers
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yaho.co.in": "yahoo.co.in",
  "iclou.com": "icloud.com",
  "protonmaill.com": "protonmail.com",
};

export interface EmailVerificationResult {
  valid: boolean;
  status: "valid" | "invalid_syntax" | "disposable" | "invalid_domain" | "typo";
  message: string;
  suggestion?: string;
}

// Common placeholder usernames and domains often typed as dummy emails
const PLACEHOLDER_USERNAMES = new Set([
  "asdf", "test", "fake", "dummy", "sample", "admin", "user", "someone", "nobody",
  "null", "undefined", "qwerty", "zxcv", "12345", "123456", "testing", "temp", "trash",
  "noemail", "none", "na", "spam", "abc", "xyz", "demo", "foo", "bar"
]);

const PLACEHOLDER_DOMAINS = new Set([
  "test.com", "example.com", "fake.com", "asdf.com", "domain.com", "sample.com",
  "website.com", "none.com", "null.com", "invalid.com", "xyz.com", "email.com"
]);

// Major email providers to detect typos against
const MAJOR_EMAIL_PROVIDERS = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
];

function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function checkEmailSyntaxAndDisposable(email: string): EmailVerificationResult | null {
  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split("@");

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      valid: false,
      status: "invalid_syntax",
      message: "Invalid email structure",
    };
  }

  const [localPart, domain] = parts;

  // 1. Check typos first so mistyped or incomplete domains (e.g. @gmil, @gmil.com, @outlok, @yaho) trigger a suggestion immediately
  const domainWithDot = domain.includes(".") ? domain : `${domain}.com`;

  if (COMMON_DOMAIN_TYPOS[domain] || COMMON_DOMAIN_TYPOS[domainWithDot]) {
    const target = COMMON_DOMAIN_TYPOS[domain] || COMMON_DOMAIN_TYPOS[domainWithDot];
    const suggestedEmail = `${localPart}@${target}`;
    return {
      valid: false,
      status: "typo",
      message: `Did you mean ${suggestedEmail}?`,
      suggestion: suggestedEmail,
    };
  }

  // Fuzzy typo check against major providers (Levenshtein distance <= 2)
  for (const major of MAJOR_EMAIL_PROVIDERS) {
    if (domain !== major) {
      const dist = getLevenshteinDistance(domainWithDot, major);
      if (dist <= 2 && Math.abs(domainWithDot.length - major.length) <= 2) {
        const suggestedEmail = `${localPart}@${major}`;
        return {
          valid: false,
          status: "typo",
          message: `Did you mean ${suggestedEmail}?`,
          suggestion: suggestedEmail,
        };
      }
    }
  }

  // Basic RFC regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!regex.test(trimmed)) {
    return {
      valid: false,
      status: "invalid_syntax",
      message: "Invalid characters or format in email address",
    };
  }

  // Disallow common fake placeholders
  if (PLACEHOLDER_USERNAMES.has(localPart) || PLACEHOLDER_DOMAINS.has(domain)) {
    return {
      valid: false,
      status: "invalid_domain",
      message: "Please provide a genuine, non-placeholder email address",
    };
  }

  // Gmail strict username length (Google requires 6-30 characters)
  if (domain === "gmail.com" && (localPart.length < 6 || localPart.length > 30)) {
    return {
      valid: false,
      status: "invalid_syntax",
      message: "Gmail usernames must be between 6 and 30 characters",
    };
  }

  // Repeated character keyboard smash (e.g. aaaaa@, 11111@)
  if (/^(.)\1{4,}$/.test(localPart)) {
    return {
      valid: false,
      status: "invalid_syntax",
      message: "Email appears to be invalid or random characters",
    };
  }

  // Disposable check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      status: "disposable",
      message: "Disposable or burner emails are not allowed",
    };
  }

  return null;
}

export async function verifyMailboxWithAbstractApi(
  email: string,
  apiKey?: string
): Promise<{
  checked: boolean;
  deliverable: boolean;
  message?: string;
  suggestion?: string;
}> {
  const key = apiKey || process.env.ABSTRACT_EMAIL_API_KEY;
  if (!key) {
    return { checked: false, deliverable: true };
  }

  try {
    // AbstractAPI Email Reputation endpoint (primary endpoint for reputation keys)
    let url = `https://emailreputation.abstractapi.com/v1/?api_key=${encodeURIComponent(
      key
    )}&email=${encodeURIComponent(email)}`;
    let res = await fetch(url, { headers: { Accept: "application/json" } });

    // Fallback to emailvalidation if key belongs to validation suite
    if (!res.ok) {
      url = `https://emailvalidation.abstractapi.com/v1/?api_key=${encodeURIComponent(
        key
      )}&email=${encodeURIComponent(email)}`;
      res = await fetch(url, { headers: { Accept: "application/json" } });
    }

    if (!res.ok) {
      return { checked: false, deliverable: true };
    }

    const data = await res.json();
    const suggestion = data.suggested_correction || data.autocorrect || undefined;

    const deliverabilityStatus = (
      data.email_deliverability?.status ||
      data.deliverability ||
      ""
    ).toLowerCase();

    const isSmtpValid =
      typeof data.email_deliverability?.is_smtp_valid === "boolean"
        ? data.email_deliverability.is_smtp_valid
        : typeof data.is_smtp_valid === "object"
        ? data.is_smtp_valid?.value
        : data.is_smtp_valid;

    const isDisposable =
      typeof data.email_deliverability?.is_disposable === "boolean"
        ? data.email_deliverability.is_disposable
        : data.email_quality?.is_disposable === true
        ? true
        : typeof data.is_disposable_email === "object"
        ? data.is_disposable_email?.value
        : data.is_disposable_email;

    // If AbstractAPI suggested a typo correction (e.g. gmil.com -> gmail.com)
    if (suggestion && suggestion.toLowerCase() !== email.toLowerCase()) {
      return {
        checked: true,
        deliverable: false,
        message: `Did you mean ${suggestion}?`,
        suggestion,
      };
    }

    if (deliverabilityStatus === "undeliverable" || isSmtpValid === false) {
      return {
        checked: true,
        deliverable: false,
        message: "Mailbox does not exist or cannot receive mail.",
        suggestion,
      };
    }

    if (isDisposable === true) {
      return {
        checked: true,
        deliverable: false,
        message: "Disposable temporary email addresses are not accepted.",
      };
    }

    return {
      checked: true,
      deliverable: true,
      message: "Mailbox verified & active.",
      suggestion,
    };
  } catch {
    return { checked: false, deliverable: true };
  }
}

export async function verifyEmailDomainMx(domain: string): Promise<boolean> {
  const cleanDomain = domain.trim().toLowerCase();

  // Try standard Node DNS first
  try {
    const mxRecords = await dns.resolveMx(cleanDomain);
    if (mxRecords && mxRecords.length > 0) {
      // RFC 7505: "Null MX" records have exchange: "" or "." with priority 0
      return mxRecords.some(
        (r) => r.exchange && r.exchange !== "." && r.exchange !== ""
      );
    }
  } catch (err: any) {
    // If standard DNS query fails or code is ENOTFOUND, try Cloudflare DNS-over-HTTPS fallback
  }

  // Cloudflare DNS-over-HTTPS fallback (100% free, works anywhere)
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
      }
    );
    const data = await res.json();
    if (data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
      return data.Answer.some(
        (a: any) =>
          a.type === 15 &&
          a.data &&
          !a.data.endsWith(". .") &&
          a.data !== "0 ."
      );
    }
  } catch {
    // In case of complete network/DNS outage, do not hard-block legitimate users
    return true;
  }

  return false;
}
