"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { PERSONAL_INFO } from "../../data/portfolioData";

// Module-scoped cache: lives in JS memory and resets only when the page is reloaded or refreshed.
let hasPlayedIntroGlobal = false;

function getCoprime(n: number): number {
  if (n <= 1) return 1;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let candidate = 7;
  while (gcd(candidate, n) !== 1) {
    candidate++;
  }
  return candidate;
}

export interface CyberFlickerTitleProps {
  text?: string;
  className?: string;
  variants?: Variants;
  forceAnimate?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "div";
}

export default function CyberFlickerTitle({
  text = PERSONAL_INFO.name,
  className = "font-bruno display-4 text-uppercase text-white tracking-scifi cyber-title-glow mb-2 my-sm-2 mb-lg-2 px-5 px-md-0 py-md-4 py-lg-2",
  variants,
  forceAnimate = false,
  as = "h1",
}: CyberFlickerTitleProps) {
  // Only animate if the intro animation hasn't run yet in this browser page lifecycle (or forceAnimate is set)
  const isIntro = !hasPlayedIntroGlobal || forceAnimate;
  const [isSettled, setIsSettled] = useState(!isIntro);

  const words = useMemo(() => {
    return text.split(" ");
  }, [text]);

  const letterDelays = useMemo(() => {
    const totalVisibleLetters = text.replace(/\s/g, "").length;
    if (totalVisibleLetters === 0) return [];

    const delays: number[] = new Array(totalVisibleLetters);
    const step = 0.12;
    const baseDelay = 0.15;
    const coprime = getCoprime(totalVisibleLetters);

    for (let i = 0; i < totalVisibleLetters; i++) {
      // Deterministic non-linear scramble: every letter gets a distinct, scattered trigger time
      const scrambledOrder = (i * coprime + 3) % totalVisibleLetters;
      // Slight analog micro-jitter
      const jitter = ((i * 11) % 5) * 0.02;
      delays[i] = Number((baseDelay + scrambledOrder * step + jitter).toFixed(3));
    }
    return delays;
  }, [text]);

  useEffect(() => {
    if (isIntro && !isSettled) {
      const maxDelay = letterDelays.length > 0 ? Math.max(...letterDelays) : 0;
      // 1.15s animation duration + max delay + small buffer to settle
      const timeoutMs = (maxDelay + 1.25) * 1000;

      const timer = setTimeout(() => {
        hasPlayedIntroGlobal = true;
        setIsSettled(true);
      }, timeoutMs);

      return () => clearTimeout(timer);
    }
  }, [isIntro, isSettled, letterDelays]);

  // When intro animation is active, keep container sharp without extra blur/opacity delay
  const activeVariants: Variants | undefined = useMemo(() => {
    if (isIntro && !isSettled) {
      const v: Variants = {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
      if (variants?.exit) {
        v.exit = variants.exit;
      }
      return v;
    }
    return variants;
  }, [isIntro, isSettled, variants]);


  const MotionComponent = as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : motion.div;

  let globalLetterCounter = 0;

  return (
    <MotionComponent
      variants={activeVariants}
      className={className}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <React.Fragment key={wordIdx}>
          <span className="d-inline-block text-nowrap">
            {word.split("").map((char, charIdx) => {
              const currentLetterIdx = globalLetterCounter++;
              const delay = letterDelays[currentLetterIdx] ?? 0.2;
              const shouldFlicker = isIntro && !isSettled;

              return (
                <span
                  key={charIdx}
                  aria-hidden="true"
                  className={shouldFlicker ? "cyber-letter-flicker" : "cyber-letter-solid"}
                  style={
                    shouldFlicker
                      ? {
                        animationDelay: `${delay}s`,
                      }
                      : undefined
                  }
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIdx < words.length - 1 && (
            <span aria-hidden="true" className="d-inline-block">
              &nbsp;
            </span>
          )}
        </React.Fragment>
      ))}
    </MotionComponent>
  );
}

export { CyberFlickerTitle };
