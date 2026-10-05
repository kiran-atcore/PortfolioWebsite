"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PERSONAL_INFO } from "@/data/portfolioData";
import CyberScrollbar from "./CyberScrollbar";

const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name required")
    .min(2, "Min 2 characters"),
  email: yup
    .string()
    .trim()
    .required("Email required")
    .email("Valid email required"),
  subject: yup
    .string()
    .trim()
    .max(150, "Max 150 characters"),
  message: yup
    .string()
    .trim()
    .required("Payload required")
    .min(10, "Min 10 characters"),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

export default function ContactMessageForm() {
  const [status, setStatus] = useState<"idle" | "transmitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastPayload, setLastPayload] = useState<ContactFormData | null>(null);
  const [emailVerification, setEmailVerification] = useState<{
    status: "idle" | "checking" | "valid" | "invalid";
    message?: string;
    suggestion?: string;
  }>({ status: "idle" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastVerifiedEmailRef = useRef<string>("");
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    mode: "onTouched",
  });

  const verifyEmailAddress = async (emailToVerify: string): Promise<boolean> => {
    const trimmed = emailToVerify.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@") || trimmed.length < 5) {
      setEmailVerification({ status: "idle" });
      return false;
    }

    // If this exact email was already verified and valid, reuse without re-querying
    if (lastVerifiedEmailRef.current === trimmed && emailVerification.status === "valid") {
      return true;
    }

    setEmailVerification({ status: "checking" });

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (!data.valid) {
        setEmailVerification({
          status: "invalid",
          message: data.message,
          suggestion: data.suggestion,
        });
        setError("email", { type: "manual", message: data.message });
        return false;
      }

      lastVerifiedEmailRef.current = trimmed;
      setEmailVerification({
        status: "valid",
        message: data.message,
      });
      clearErrors("email");
      return true;
    } catch {
      setEmailVerification({ status: "idle" });
      return true;
    }
  };

  const applySuggestion = (suggested: string) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setValue("email", suggested, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    verifyEmailAddress(suggested);
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("transmitting");
    setErrorMessage("");
    setLastPayload(data);

    // Verify email host existence and MX records before transmission
    const isEmailValid = await verifyEmailAddress(data.email);
    if (!isEmailValid) {
      setStatus("idle");
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "bce5386f-05e0-4a27-a8dd-bd8613c1d0ee";

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: apiKey,
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject?.trim()
            ? `[Direct Transmission] ${data.subject.trim()}`
            : `[Direct Transmission] Inquiry from ${data.name.trim()}`,
          message: data.message.trim(),
          from_name: `${data.name.trim()} via Portfolio`,
        }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Direct transmission failed to deliver.");
      }

      setStatus("sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Direct transmission gateway error";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  const triggerMailtoFallback = (data?: ContactFormData | null) => {
    const target = data || lastPayload;
    if (!target) return;
    const mailtoSubject = encodeURIComponent(target.subject || `Inquiry from ${target.name}`);
    const mailtoBody = encodeURIComponent(`From: ${target.name} (${target.email})\n\n${target.message}`);
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleReset = () => {
    reset();
    setStatus("idle");
    setErrorMessage("");
    setLastPayload(null);
    setEmailVerification({ status: "idle" });
    lastVerifiedEmailRef.current = "";
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  };

  return (
    <div className="contact-cyber-card contact-message-card position-relative mx-2 h-100 overflow-hidden d-flex flex-column">
      {/* Aerospace Frame Rims */}
      <span className="contact-rim contact-rim-tl" aria-hidden="true" />
      <span className="contact-rim contact-rim-tr" aria-hidden="true" />
      <span className="contact-rim contact-rim-bl" aria-hidden="true" />
      <span className="contact-rim contact-rim-br" aria-hidden="true" />

      <style>{`
        @media (max-width: 767.98px) {
          .contact-message-card {
            max-height: 540px !important;
            height: 520px !important;
          }
        }
        .cyber-scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .cyber-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .contact-input::placeholder,
        .contact-textarea::placeholder,
        .contact-input::-webkit-input-placeholder,
        .contact-textarea::-webkit-input-placeholder,
        .contact-input::-moz-placeholder,
        .contact-textarea::-moz-placeholder {
          font-family: 'Outfit', sans-serif !important;
        }
        .contact-form-label {
          display: flex !important;
          align-items: center;
          user-select: none;
          gap: 0.35rem;
          min-height: 1.45rem;
          margin-bottom: 0.25rem;
        }
        .contact-label-tag {
          color: #00f2fe !important;
          font-family: var(--font-jetbrains-mono, monospace);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .contact-label-text {
          color: rgba(241, 245, 249, 0.9);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          letter-spacing: 0.08em;
          transition: all 0.25s ease;
          white-space: nowrap !important;
          flex-shrink: 0;
        }
        .contact-label-badge {
          color: #00f2fe;
          opacity: 0.85;
          font-size: 0.72em;
          font-weight: 700;
          text-shadow: 0 0 6px rgba(0, 242, 254, 0.5);
          flex-shrink: 0;
        }
        .contact-label-optional {
          color: rgba(148, 163, 184, 0.6);
          font-family: var(--font-jetbrains-mono, monospace);
          font-size: 0.65em;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }
        .contact-form-error {
          color: #ff4b72 !important;
          font-family: var(--font-jetbrains-mono, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px rgba(255, 75, 114, 0.45);
          line-height: 1.25;
        }
        .contact-input.is-invalid,
        .contact-textarea.is-invalid {
          border-color: rgba(255, 75, 114, 0.65) !important;
          box-shadow: 0 0 10px rgba(255, 75, 114, 0.22) !important;
        }
        .contact-input.is-valid {
          border-color: rgba(0, 255, 170, 0.55) !important;
          box-shadow: 0 0 10px rgba(0, 255, 170, 0.22) !important;
        }
        .col-12:has(.contact-input:focus) .contact-label-tag,
        div:has(.contact-input:focus) .contact-label-tag,
        div:has(.contact-textarea:focus) .contact-label-tag {
          color: #38bdf8 !important;
          text-shadow: 0 0 12px rgba(0, 242, 254, 0.8), 0 0 22px rgba(0, 242, 254, 0.45);
        }
        .col-12:has(.contact-input:focus) .contact-label-text,
        div:has(.contact-input:focus) .contact-label-text,
        div:has(.contact-textarea:focus) .contact-label-text {
          color: #ffffff !important;
          text-shadow: 0 0 10px rgba(0, 242, 254, 0.35);
        }
      `}</style>

      <div ref={scrollRef} className="contact-form-scroll-body cyber-scroll-container flex-grow-1 overflow-auto d-flex flex-column justify-content-between px-3 pe-4">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2 mb-md-4 border-bottom border-white border-opacity-10 pb-2 pb-md-3">
            <h2 className="font-syne fw-bold text-info text-uppercase tracking-wider contact-card-title mb-0 d-flex align-items-center gap-3">
              <i className="bi bi-terminal-fill" /> Direct Transmission
            </h2>
            <span className="font-space-grotesk text-light text-opacity-50 small" style={{ fontSize: "0.5rem", letterSpacing: 2 }}>{"// TLS-ENCRYPTED"}</span>
          </div>

          {status === "sent" ? (
            <div className="text-center py-3 py-md-3">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: "rgba(0, 242, 254, 0.12)", border: "1px solid rgba(0, 242, 254, 0.4)" }}>
                <i className="bi bi-shield-check text-cyan display-6" />
              </div>
              <h3 className="font-syne fw-bold text-white text-uppercase tracking-wider mb-2" style={{ fontSize: "1.2rem" }}>Transmission Acknowledged</h3>
              <p className="font-outfit text-light fw-light text-opacity-50 small mb-4 mx-auto" style={{ maxWidth: "420px" }}>
                Your message was compiled and dispatched. Kiran will initiate communication promptly.
              </p>
              <button style={{ fontSize: "0.9rem" }} type="button" onClick={handleReset} className="btn btn-cyber-glass rounded-pill px-4 py-2 font-syncopate small tracking-wider text-uppercase">
                <i className="bi bi-arrow-repeat me-2" /> Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-2 gap-md-3" noValidate>
              <div className="row g-2 g-md-3">
                <div className="col-12 col-sm-6">
                  <div className="contact-form-label">
                    <span className="contact-label-tag">[01]</span>
                    <span className="contact-label-text">YOUR NAME</span>
                    <span className="contact-label-badge" title="Required">*</span>
                  </div>
                  <input
                    type="text"
                    {...register("name")}
                    className={`contact-input form-control w-100 ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Recruiter / Collaborator"
                  />
                  {errors.name && (
                    <div className="contact-form-error mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: "0.65rem" }} />
                      <span>{errors.name.message}</span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <div className="contact-form-label justify-content-between">
                    <div className="d-flex align-items-center gap-1">
                      <span className="contact-label-tag">[02]</span>
                      <span className="contact-label-text">YOUR EMAIL</span>
                      <span className="contact-label-badge" title="Required">*</span>
                    </div>
                    {emailVerification.status === "checking" && (
                      <span className="ms-auto font-jetbrains-mono text-cyan d-flex align-items-center gap-1" style={{ fontSize: "0.68rem" }}>
                        <span className="spinner-border spinner-border-sm" style={{ width: "0.6rem", height: "0.6rem" }} />
                        VERIFYING...
                      </span>
                    )}
                    {emailVerification.status === "valid" && !errors.email && (
                      <span className="ms-auto font-jetbrains-mono text-success d-flex align-items-center gap-1" style={{ fontSize: "0.68rem", textShadow: "0 0 8px rgba(0, 255, 170, 0.45)" }}>
                        <i className="bi bi-shield-check" /> VERIFIED
                      </span>
                    )}
                  </div>
                  {(() => {
                    const emailField = register("email");
                    return (
                      <input
                        type="email"
                        {...emailField}
                        onBlur={async (e) => {
                          if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                          emailField.onBlur(e);

                          // Avoid re-verifying old misspelled value if blur was caused by clicking the suggestion button
                          const relatedTarget = e.relatedTarget as HTMLElement | null;
                          if (relatedTarget?.getAttribute("data-email-suggestion") === "true") {
                            return;
                          }

                          if (e.target.value) {
                            await verifyEmailAddress(e.target.value);
                          }
                        }}
                        onChange={(e) => {
                          emailField.onChange(e);
                          const val = e.target.value;

                          if (typingTimerRef.current) {
                            clearTimeout(typingTimerRef.current);
                          }

                          if (emailVerification.status !== "idle") {
                            setEmailVerification({ status: "idle" });
                            clearErrors("email");
                          }

                          // Auto-detect typos and verify when user pauses typing
                          if (val.includes("@") && val.split("@")[1].length >= 2) {
                            typingTimerRef.current = setTimeout(() => {
                              verifyEmailAddress(val);
                            }, 500);
                          }
                        }}
                        className={`contact-input form-control w-100 ${errors.email || emailVerification.status === "invalid"
                            ? "is-invalid"
                            : emailVerification.status === "valid"
                              ? "is-valid"
                              : ""
                          }`}
                        placeholder="name@organization.com"
                      />
                    );
                  })()}
                  {errors.email && (
                    <div className="contact-form-error mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: "0.65rem" }} />
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                  {emailVerification.suggestion && (
                    <div className="mt-1 d-flex align-items-center gap-1">
                      <span className="font-jetbrains-mono text-light text-opacity-50 small" style={{ fontSize: "0.7rem" }}>
                        Suggestion:
                      </span>
                      <button
                        type="button"
                        data-email-suggestion="true"
                        onMouseDown={(e) => {
                          // Prevent input from losing focus / triggering onBlur before click completes
                          e.preventDefault();
                        }}
                        onClick={() => {
                          const suggested = emailVerification.suggestion;
                          if (suggested) {
                            applySuggestion(suggested);
                          }
                        }}
                        className="btn btn-sm btn-link text-cyan p-0 font-jetbrains-mono text-decoration-none"
                        style={{ fontSize: "0.72rem" }}
                      >
                        <i className="bi bi-magic me-1" />
                        {emailVerification.suggestion}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="contact-form-label">
                  <span className="contact-label-tag">[03]</span>
                  <span className="contact-label-text">SUBJECT</span>
                  <span className="contact-label-optional ms-1">(OPTIONAL)</span>
                </div>
                <input
                  type="text"
                  {...register("subject")}
                  className={`contact-input form-control w-100 ${errors.subject ? "is-invalid" : ""}`}
                  placeholder="Software Role / AI Advisory / Project Discussion"
                />
                {errors.subject && (
                  <div className="contact-form-error mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: "0.65rem" }} />
                    <span>{errors.subject.message}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="contact-form-label">
                  <span className="contact-label-tag">[04]</span>
                  <span className="contact-label-text">TRANSMISSION PAYLOAD</span>
                  <span className="contact-label-badge" title="Required">*</span>
                </div>
                <textarea
                  rows={4}
                  {...register("message")}
                  className={`contact-textarea form-control w-100 ${errors.message ? "is-invalid" : ""}`}
                  placeholder="Detail the technical specifications, role requirements, or project roadmap..."
                />
                {errors.message && (
                  <div className="contact-form-error mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: "0.65rem" }} />
                    <span>{errors.message.message}</span>
                  </div>
                )}
              </div>

              {status === "error" && (
                <div
                  className="p-3 rounded-3 font-jetbrains-mono small text-start border"
                  style={{
                    backgroundColor: "rgba(255, 75, 114, 0.1)",
                    borderColor: "rgba(255, 75, 114, 0.4)",
                    color: "#ff8fa3",
                  }}
                >
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-exclamation-triangle-fill text-danger mt-1" />
                    <div>
                      <strong className="d-block text-uppercase" style={{ letterSpacing: "0.05em", color: "#ff6b8b" }}>
                        Transmission Uplink Interrupted
                      </strong>
                      <span className="small opacity-85 text-light">{errorMessage}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-2 pt-2 border-top border-white border-opacity-10">
                    <button
                      type="button"
                      onClick={() => triggerMailtoFallback()}
                      className="btn btn-sm btn-outline-info text-uppercase font-jetbrains-mono px-3 py-1"
                      style={{ fontSize: "0.72rem" }}
                    >
                      <i className="bi bi-envelope-fill me-1" /> Use Mail Client Fallback
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={status === "transmitting"} className="btn btn-neon-cyan contact-submit-btn rounded-pill w-100 font-syncopate tracking-wider text-uppercase d-flex align-items-center justify-content-center gap-2 mt-1">
                {status === "transmitting" ? (
                  <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /><span>TRANSMITTING...</span></>
                ) : (
                  <><i className="bi bi-send-fill" /><span>DISPATCH TRANSMISSION &rarr;</span></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <CyberScrollbar scrollContainerRef={scrollRef} />
    </div>
  );
}
