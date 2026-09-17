"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import CardsHoloCore3D from "./CardsHoloCore3D";
import CardDetailModal from "./CardDetailModal";
import { HERO_CARDS, HeroCardData } from "@/data/heroCardsData";

const cardVariants: Variants = {
  hidden: (config: { index: number, entryConfig: { x: number; y: number; rotate: number; scale: number } }) => ({
    opacity: 0,
    x: config.entryConfig.x,
    y: config.entryConfig.y,
    rotateZ: config.entryConfig.rotate,
    scale: config.entryConfig.scale,
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
      stiffness: 150,
      damping: 20,
      mass: 1,
      delay: config.index * 0.1,
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
        {HERO_CARDS.map((card, index) => (
          <motion.div
            key={card.id}
            custom={{ index, entryConfig: card.entryConfig }}
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
        ))}
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

