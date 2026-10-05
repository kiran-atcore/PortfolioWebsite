"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import ExperienceCardProduction from "./ExperienceCardProduction";
import ExperienceCardAcademic from "./ExperienceCardAcademic";
import {
  subscribeExperienceTab,
  ExperienceTabType,
} from "@/lib/slideEvents";
import { EXPERIENCES, EDUCATION } from "@/data/portfolioData";

const tabVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 45 : -45,
    filter: "blur(8px)",
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -45 : 45,
    filter: "blur(8px)",
    scale: 0.98,
    transition: {
      duration: 0.28,
      ease: "easeInOut" as const,
    },
  }),
};

export default function ExperienceContainer() {
  const [activeTab, setActiveTab] = useState<ExperienceTabType>("production");
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const lastScrollTime = useRef<number>(0);

  const isLgOrGreater = useMediaQuery("(min-width: 992px)");

  const cardList = activeTab === "production" ? EXPERIENCES : EDUCATION;
  const totalCards = cardList.length;

  useEffect(() => {
    const unsub = subscribeExperienceTab((newTab) => {
      setActiveTab((prev) => {
        if (prev !== newTab) {
          setDirection(newTab === "academic" ? 1 : -1);
          setCurrentCardIndex(0);
        }
        return newTab;
      });
    });
    return unsub;
  }, []);

  const handleNext = useCallback(() => {
    if (currentCardIndex < totalCards - 1) {
      setDirection(1);
      setCurrentCardIndex((prev) => prev + 1);
    }
  }, [currentCardIndex, totalCards]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setDirection(-1);
      setCurrentCardIndex((prev) => prev - 1);
    }
  }, [currentCardIndex]);

  const goToCard = useCallback(
    (idx: number) => {
      if (idx === currentCardIndex) return;
      setDirection(idx > currentCardIndex ? 1 : -1);
      setCurrentCardIndex(idx);
    },
    [currentCardIndex]
  );

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -35 || info.velocity.x < -300) {
      handleNext();
    } else if (info.offset.x > 35 || info.velocity.x > 300) {
      handlePrev();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return;
    if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
      if (e.deltaY > 0 || e.deltaX > 0) {
        if (currentCardIndex < totalCards - 1) {
          lastScrollTime.current = now;
          handleNext();
        }
      } else {
        if (currentCardIndex > 0) {
          lastScrollTime.current = now;
          handlePrev();
        }
      }
    }
  };

  return (
    <div
      className="position-relative w-100 h-100 d-flex flex-column justify-content-start align-items-center overflow-hidden"
      style={{
        paddingTop: "calc(max(0.75rem, env(safe-area-inset-top, 0.75rem)) + 58px)",
        paddingBottom: "calc(max(1.25rem, env(safe-area-inset-bottom, 1.25rem)) + 60px)",
      }}
    >
      {/* Header section on top just below the top navbar ribbon */}
      <div className="text-center pt-1 pb-2 px-3 flex-shrink-0 position-relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-1"
        >
          <span className="pulse-cyan" aria-hidden="true" />
          <span className="text-light fw-medium font-syne tracking-wide about-telemetry-badge-text">
            {"// TELEMETRY: CAREER_TIMELINE //"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne fw-bold text-uppercase text-white cyber-title-glow about-slide-title mb-1"
        >
          Work Experience
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="font-space-grotesk fw-semibold text-uppercase about-slide-subtitle mb-2 mb-lg-0 mx-auto"
          style={{ maxWidth: "700px", color: "#00f2fe" }}
        >
          Engineering real-world systems in fast-paced production environments
        </motion.p>
      </div>

      {/* Container with tab cards, single swipe/scroll snap, and telemetry indicators */}
      <div
        className="w-100 container py-1 px-3 d-flex justify-content-center align-items-center flex-shrink-0 experience-stage-container"
        style={{ zIndex: 2 }}
      >
        <div
          className={`w-100 h-100 position-relative ${activeTab === "production" && 'pb-lg-1'} d-flex flex-column justify-content-between overflow-hidden p-0`}
          style={{
            maxWidth: 800,
            border: "1px solid #00f2fe",
            borderRadius: "14px",
            background: "rgba(4, 9, 22, 0.1)",
            boxShadow:
              "0 12px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 242, 254, 0.12), inset 0 1px 1px rgba(0, 242, 254, 0.3)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          onWheel={handleWheel}
        >
          {/* Card Viewport with swipe/drag */}
          <div className="w-100 flex-grow-1 overflow-hidden position-relative d-flex flex-column justify-content-center p-2 p-sm-2 p-md-3" >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${activeTab}-${currentCardIndex}`}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="w-100 h-100 d-flex flex-column justify-content-center user-select-none px-2"
                style={{ touchAction: "pan-y" }}
              >
                {activeTab === "production" ? (
                  <ExperienceCardProduction
                    item={EXPERIENCES[currentCardIndex]}
                    currentIndex={currentCardIndex}
                    totalCards={totalCards}
                  />
                ) : (
                  <ExperienceCardAcademic
                    item={EDUCATION[currentCardIndex]}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>


        </div>
      </div>
    </div>
  );
}
