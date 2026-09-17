"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { HeroCardData } from "@/data/heroCardsData";
import CardModalHolo3D from "./CardModalHolo3D";

interface CardDetailModalProps {
  card: HeroCardData | null;
  allCards: HeroCardData[];
  onClose: () => void;
  onSelectCard: (card: HeroCardData) => void;
}

interface ModalOrigin {
  x: number;
  y: number;
  scale: number;
}

function calculateCardOrigin(cardId?: string): ModalOrigin {
  if (typeof window === "undefined" || !cardId) {
    return { x: 0, y: 16, scale: 0.9 };
  }

  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-hero-card-id="${cardId}"], #hero-card-${cardId}`
    )
  );

  let targetEl: HTMLElement | null = null;
  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      targetEl = el;
      break;
    }
  }

  if (!targetEl) {
    return { x: 0, y: 16, scale: 0.9 };
  }

  const rect = targetEl.getBoundingClientRect();
  const cardCenterX = rect.left + rect.width / 2;
  const cardCenterY = rect.top + rect.height / 2;

  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;

  const deltaX = cardCenterX - viewportCenterX;
  const deltaY = cardCenterY - viewportCenterY;

  const modalWidth = Math.min(window.innerWidth - 32, 880);
  const rawScale = rect.width / modalWidth;
  const scale = Math.max(0.18, Math.min(0.85, rawScale));

  return {
    x: Math.round(deltaX),
    y: Math.round(deltaY),
    scale: Number(scale.toFixed(4)),
  };
}

const modalVariants: Variants = {
  initial: (origin: ModalOrigin) => ({
    opacity: 0,
    x: origin.x,
    y: origin.y,
    scale: origin.scale,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as const,
      opacity: { duration: 0.22, ease: "easeOut" as const },
      filter: { duration: 0.22, ease: "easeOut" as const },
    },
  },
  exit: (origin: ModalOrigin) => ({
    opacity: 0,
    x: origin.x,
    y: origin.y,
    scale: origin.scale,
    filter: "blur(3px)",
    transition: {
      duration: 0.26,
      ease: [0.36, 0, 0.2, 1] as const,
      opacity: { duration: 0.2, ease: "easeIn" as const, delay: 0.04 },
      filter: { duration: 0.2, ease: "easeIn" as const },
    },
  }),
};

const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.24, ease: "easeInOut" as const },
  },
};

export default function CardDetailModal({
  card: incomingCard,
  allCards,
  onClose,
  onSelectCard,
}: CardDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const lastActiveCardRef = React.useRef<HeroCardData | null>(incomingCard);
  if (incomingCard) {
    lastActiveCardRef.current = incomingCard;
  }
  const card = incomingCard || lastActiveCardRef.current;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (incomingCard) {
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
    }
  }, [incomingCard]);

  const handleExitComplete = () => {
    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("modal-open");
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    };
  }, []);

  const currentIndex = card ? allCards.findIndex((c) => c.id === card.id) : -1;
  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + allCards.length) % allCards.length;
    onSelectCard(allCards[prevIdx]);
  };
  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % allCards.length;
    onSelectCard(allCards[nextIdx]);
  };

  useEffect(() => {
    if (!incomingCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [incomingCard, currentIndex, onClose]);

  if (!mounted || !card) return null;

  const origin = calculateCardOrigin(card.id);
  const isCyan = card.themeColor === "cyan";
  const accentColorClass = isCyan ? "text-info" : "text-magenta";
  const accentBorderClass = isCyan ? "border-info/30" : "border-magenta/30";

  return createPortal(
    <AnimatePresence custom={origin} onExitComplete={handleExitComplete}>
      {incomingCard && (
        <motion.div
          key="cyber-modal-overlay-wrapper"
          className="cyber-modal-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { when: "afterChildren" } }}
          onWheel={(e) => {
            const isScrollable = (e.target as HTMLElement)?.closest?.(".cyber-modal-body");
            if (!isScrollable) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onTouchMove={(e) => {
            const isScrollable = (e.target as HTMLElement)?.closest?.(".cyber-modal-body");
            if (!isScrollable) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            key="cyber-modal-backdrop"
            className="cyber-modal-backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            key="cyber-modal-container"
            className={`cyber-modal-container rounded-4 ${isCyan ? "cyber-modal-cyan" : "cyber-modal-magenta"
              }`}
            custom={origin}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              transformOrigin: "center center",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cyber-modal-title"
          >
            {/* Top HUD Telemetry Bar (Pinned) */}
            <div className="cyber-modal-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span className={`pulse-beacon ${isCyan ? "beacon-cyan" : "beacon-magenta"}`} />
                <span className="font-space-grotesk small text-secondary-white" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", opacity: 0.5 }}>
                  {card.telemetryCode}
                </span>
              </div>

              <div className={`font-syne fw-bold small ${accentColorClass}`} style={{ letterSpacing: "0.15em", fontSize: "0.75rem" }}>
                {card.tag}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="cyber-modal-close-btn d-flex align-items-center gap-1"
                aria-label="Close modal"
              >
                <span className="font-syncopate text-light d-none d-sm-inline me-1" style={{ fontSize: "0.68rem", opacity: 0.5 }}>ESC</span>
                <span className="cyber-close-cross font-space-grotesk">✕</span>
              </button>
            </div>

            {/* Modal Body (Scrollable if viewport is tiny) */}
            <div className="cyber-modal-body">
              <div className="row g-3 g-md-4 align-items-center">
                {/* Visual Avatar + 3D Hologram Column */}
                <div className="col-12 col-md-5 text-center">
                  <div className="cyber-avatar-wrapper position-relative w-100 mx-auto">
                    {/* Embedded 3D Three.js Holo Background */}
                    <CardModalHolo3D accentHex={card.accentHex} />

                    {/* Image Frame */}
                    <div className="cyber-avatar-frame position-relative rounded-4 overflow-hidden mx-auto">
                      <Image
                        src={card.src}
                        alt={`Kiran Chand S - ${card.roleTitle}`}
                        width={260}
                        height={260}
                        className="cyber-avatar-img w-100 h-auto"
                        priority
                      />
                      <div className="cyber-avatar-scanline" />
                      <div className="cyber-avatar-hud-corners" />
                    </div>

                    {/* Stats Ticker Under Avatar - Rendered on top of 3D canvas (z-index 10) */}
                    <div className="cyber-avatar-stats-wrap d-flex justify-content-center gap-2 mt-2 position-relative" style={{ zIndex: 10 }}>
                      {card.stats.map((stat, i) => (
                        <div key={i} className="cyber-mini-stat px-2 py-1 rounded">
                          <div className={`fw-bold small font-space-grotesk ${accentColorClass}`} style={{ fontSize: "0.8rem" }}>
                            {stat.value}
                          </div>
                          <div className="text-secondary-white font-outfit" style={{ fontSize: "0.6rem", letterSpacing: 1 }}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details & Telemetry Column */}
                <div className="col-12 col-md-7">
                  <div className="cyber-details-content">

                    <h3 id="cyber-modal-title" className="font-syne fw-bold text-white my-1 text-uppercase" style={{ fontSize: "1.4rem", letterSpacing: 3 }}>
                      {card.roleTitle}
                    </h3>
                    <p className={`${accentColorClass} small mb-2 font-space-grotesk`} style={{ letterSpacing: 1, fontSize: "0.9rem" }}>
                      {card.roleSubtitle}
                    </p>

                    <p className="text-secondary-white font-outfit small line-height-relaxed my-3" style={{ fontSize: "0.75rem", fontWeight: 100 }}>
                      {card.description}
                    </p>

                    {/* Highlights */}
                    <div className="cyber-highlights mb-3">
                      <div className="font-space-grotesk text-white mb-1" style={{ fontSize: "0.7rem", letterSpacing: 3 }}>
                        // VERIFIED IMPACT & ACHIEVEMENTS:
                      </div>
                      <ul className="list-unstyled font-outfit fw-light my-3 d-flex flex-column gap-1">
                        {card.highlights.map((h, i) => (
                          <li key={i} className="d-flex align-items-start gap-2 small text-secondary-white" style={{ fontSize: "0.75rem" }}>
                            <span className={accentColorClass}>▹</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="cyber-tech-chips d-flex flex-wrap gap-1.5 font-syn fw-light">
                      {card.techStack.map((tech, i) => (
                        <span key={i} className={`cyber-chip px-2 py-0.5 rounded ${accentBorderClass}`} style={{ letterSpacing: 2, fontSize: "0.65rem" }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Bottom HUD Action Bar */}
            <div className="cyber-modal-footer d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn btn-cyber-glass px-3 py-1.5 rounded-pill font-mono tracking-wider text-uppercase"
                  style={{ fontSize: "0.65rem" }}
                  title="Previous Persona"
                >
                  ◀ PREV
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-cyber-glass px-3 py-1.5 rounded-pill font-mono tracking-wider text-uppercase"
                  style={{ fontSize: "0.65rem" }}
                  title="Next Persona"
                >
                  NEXT ▶
                </button>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="font-mono text-light" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", opacity: 0.5 }}>
                  {currentIndex + 1} / {allCards.length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
