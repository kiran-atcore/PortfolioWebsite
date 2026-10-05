"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import CardsHoloCore3D from "./CardsHoloCore3D";
import CardDetailModal from "./CardDetailModal";
import { HERO_CARDS, HeroCardData } from "@/data/heroCardsData";

interface CornerConfig {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

const getCornerConfig = (index: number, width: number, height: number): CornerConfig => {
  const isMobile = width < 992;

  if (isMobile) {
    const isSmallMobile = width < 400;
    // Mobile view: cards leap in from the 4 outer corners of the mobile viewport
    const xDist = Math.max(Math.round(width * 0.58), isSmallMobile ? 170 : 210);
    const yDist = Math.max(Math.round(height * 0.38), isSmallMobile ? 210 : 260);
    const baseScale = isSmallMobile ? 0.44 : 0.5;

    switch (index) {
      case 0: // Top-Left (pose-1)
        return { x: -xDist, y: -yDist, rotate: -24, scale: baseScale };
      case 1: // Top-Right (pose-3)
        return { x: xDist, y: -yDist, rotate: 24, scale: baseScale };
      case 2: // Bottom-Left (pose-2)
        return { x: -xDist, y: yDist, rotate: 18, scale: baseScale };
      case 3: // Bottom-Right (pose-4)
      default:
        return { x: xDist, y: yDist, rotate: -18, scale: baseScale };
    }
  }

  // Desktop view: grid is positioned on the right side of the screen
  // Left cards leap from far left corners across the screen; right cards leap from right corners
  const leftXDist = Math.max(Math.round(width * 0.55), 560);
  const rightXDist = Math.max(Math.round(width * 0.35), 400);
  const yDist = Math.max(Math.round(height * 0.44), 380);

  switch (index) {
    case 0: // Top-Left (pose-1)
      return { x: -leftXDist, y: -yDist, rotate: -28, scale: 0.45 };
    case 1: // Top-Right (pose-3)
      return { x: rightXDist, y: -yDist, rotate: 28, scale: 0.45 };
    case 2: // Bottom-Left (pose-2)
      return { x: -leftXDist, y: yDist, rotate: 22, scale: 0.45 };
    case 3: // Bottom-Right (pose-4)
    default:
      return { x: rightXDist, y: yDist, rotate: -22, scale: 0.45 };
  }
};

const cardVariants: Variants = {
  hidden: (config: { corner: CornerConfig }) => ({
    opacity: 0,
    x: config.corner.x,
    y: config.corner.y,
    rotateZ: config.corner.rotate,
    scale: config.corner.scale,
    filter: "blur(10px)",
  }),
  visible: (config: { index: number }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 15,
      mass: 0.9,
      delay: config.index * 0.07,
      opacity: {
        duration: 0.32,
        ease: "easeOut",
        delay: config.index * 0.07,
      },
      filter: {
        duration: 0.4,
        ease: "easeOut",
        delay: config.index * 0.07,
      },
    },
  }),
  exit: (config: { index?: number }) => ({
    opacity: [1, 0.15, 0.9, 0.05, 0.7, 0], // Holographic glitch dissolve
    scale: [1, 1.04, 0.96, 1.02, 0.95, 0.88],
    filter: ["blur(0px)", "blur(3px)", "blur(1px)", "blur(5px)", "blur(2px)", "blur(12px)"],
    transition: {
      duration: 0.75 + ((config?.index ?? 0) % 2) * 0.1,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut",
      delay: (config?.index ?? 0) * 0.05,
    },
  }),
};

interface HeroCardGridProps {
  selectedCard?: HeroCardData | null;
  onSelectCard?: (card: HeroCardData | null) => void;
}

export default function HeroCardGrid({
  selectedCard: externalSelected,
  onSelectCard: externalOnSelect,
}: HeroCardGridProps = {}) {
  const [internalSelected, setInternalSelected] = useState<HeroCardData | null>(null);
  const selectedCard = externalSelected !== undefined ? externalSelected : internalSelected;
  const handleSelect = externalOnSelect || setInternalSelected;

  const [winSize, setWinSize] = useState(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1200, height: 800 };
  });

  useEffect(() => {
    const handleResize = () => {
      setWinSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="hero-grid-container position-relative w-100">
      {/* Ambient background glow ring */}
      <motion.div
        className="hero-grid-ambient-glow"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* 3D Single Cyber Halo - Behind cards */}
      <CardsHoloCore3D />

      <div className="hero-cyber-grid">
        {HERO_CARDS.map((card, index) => {
          const corner = getCornerConfig(index, winSize.width, winSize.height);
          return (
            <motion.div
              key={card.id}
              custom={{ index, corner }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="hero-cyber-card"
            role="button"
            tabIndex={0}
            aria-label={`View dossier for ${card.roleTitle}`}
            onClick={() => handleSelect(card)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(card);
              }
            }}
          >
            <div className={`hero-card-offset-wrapper ${card.offsetClass}`}>
              <div
                id={`hero-card-${card.id}`}
                data-hero-card-id={card.id}
                className="hero-card-inner rounded-4 overflow-hidden position-relative cursor-pointer"
              >
                <Image
                  src={card.src}
                  alt={`Kiran Chand S - ${card.tag}`}
                  width={340}
                  height={340}
                  priority
                  className="hero-card-img"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <div className="hero-card-overlay"></div>

                <div className="hero-card-tag font-syne small">
                  <span style={{ fontSize: "0.6rem" }}>{card.tag}</span>
                  <span
                    className="rounded-circle d-inline-block"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: card.themeColor === "cyan" ? "#00f2fe" : "#ec4899",
                      boxShadow: `0 0 8px ${card.themeColor === "cyan" ? "#00f2fe" : "#ec4899"}`,
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      </div>

      {/* Interactive 3D Card Detail Modal (Rendered internally only if not externally controlled) */}
      {externalOnSelect === undefined && (
        <CardDetailModal
          card={selectedCard}
          allCards={HERO_CARDS}
          onClose={() => handleSelect(null)}
          onSelectCard={(c) => handleSelect(c)}
        />
      )}
    </div>
  );
}

