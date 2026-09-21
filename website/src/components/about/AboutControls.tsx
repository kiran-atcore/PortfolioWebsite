"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AboutControlsRibbon3D from "./AboutControlsRibbon3D";
import {
  subscribeAboutSlideState,
  publishAboutSlideAction,
  AboutSlideStatePayload,
} from "@/lib/slideEvents";

interface AboutControlsProps {
  currentSlide?: number;
  totalSlides?: number;
  isPlaying?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onTogglePlay?: () => void;
  onSelectSlide?: (index: number) => void;
  className?: string;
}

export default function AboutControls({
  currentSlide: propCurrent,
  totalSlides: propTotal,
  isPlaying: propIsPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onSelectSlide,
  className = "",
}: AboutControlsProps) {
  const [internalState, setInternalState] = useState<AboutSlideStatePayload>({
    currentSlide: 0,
    totalSlides: 3,
    isPlaying: true,
  });

  useEffect(() => {
    const unsub = subscribeAboutSlideState((payload) => {
      setInternalState(payload);
    });
    return unsub;
  }, []);

  const currentSlide = typeof propCurrent === "number" ? propCurrent : internalState.currentSlide;
  const totalSlides = typeof propTotal === "number" ? propTotal : internalState.totalSlides;
  const isPlaying = typeof propIsPlaying === "boolean" ? propIsPlaying : internalState.isPlaying;

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      setInternalState((prev) => ({
        ...prev,
        currentSlide: prev.currentSlide === 0 ? prev.totalSlides - 1 : prev.currentSlide - 1,
      }));
      publishAboutSlideAction("prev");
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      setInternalState((prev) => ({
        ...prev,
        currentSlide: (prev.currentSlide + 1) % prev.totalSlides,
      }));
      publishAboutSlideAction("next");
    }
  };

  const handleTogglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }));
      publishAboutSlideAction("togglePlay");
    }
  };

  const handleSelectSlide = (idx: number) => {
    if (onSelectSlide) {
      onSelectSlide(idx);
    } else {
      setInternalState((prev) => ({
        ...prev,
        currentSlide: idx,
      }));
      publishAboutSlideAction(idx);
    }
  };

  return (
    <div
      className={`position-relative d-inline-flex align-items-center gap-1.5 px-3 rounded-pill shadow-sm ${className}`}
      style={{
        height: "37px",
        background: "rgba(4, 9, 20, 0.88)",
        border: isPlaying
          ? "1px solid rgba(0, 242, 254, 0.35)"
          : "1px solid rgba(255, 42, 133, 0.35)",
        backdropFilter: "blur(20px)",
        boxShadow: isPlaying
          ? "0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px rgba(0, 242, 254, 0.14)"
          : "0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px rgba(255, 42, 133, 0.14)",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        overflow: "hidden",
        zIndex: 1045,
      }}
    >
      {/* Three.js Interactive Quantum Ribbon Under-Glow (Perimeter-anchored) */}
      <AboutControlsRibbon3D
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        isPlaying={isPlaying}
      />

      {/* Left Chevron Button */}
      <motion.button
        type="button"
        onClick={handlePrev}
        whileHover={{
          scale: 1.15,
          x: -1,
          backgroundColor: "rgba(0, 242, 254, 0.14)",
          borderColor: "rgba(0, 242, 254, 0.75)",
          boxShadow: "0 0 8px rgba(0, 242, 254, 0.45)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="btn rounded-circle p-0 d-flex align-items-center justify-content-center position-relative"
        style={{
          width: "22px",
          height: "22px",
          flexShrink: 0,
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(0, 242, 254, 0.25)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 1px 4px rgba(0, 0, 0, 0.4)",
        }}
        aria-label="Previous Slide"
        title="Previous Slide"
      >
        <motion.i
          whileHover={{ scale: 1.15 }}
          className="bi bi-chevron-left"
          style={{ color: "#00f2fe", fontSize: "0.62rem", filter: "drop-shadow(0 0 3px rgba(0, 242, 254, 0.4))" }}
        />
      </motion.button>

      {/* Play/Pause Button */}
      <motion.button
        type="button"
        onClick={handleTogglePlay}
        whileHover={{
          scale: 1.15,
          backgroundColor: isPlaying ? "rgba(0, 242, 254, 0.14)" : "rgba(255, 42, 133, 0.14)",
          borderColor: isPlaying ? "rgba(0, 242, 254, 0.75)" : "rgba(255, 42, 133, 0.75)",
          boxShadow: isPlaying
            ? "0 0 8px rgba(0, 242, 254, 0.5)"
            : "0 0 8px rgba(255, 42, 133, 0.6)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="btn mx-2 rounded-circle p-0 d-flex align-items-center justify-content-center position-relative"
        style={{
          width: "20px",
          height: "20px",
          flexShrink: 0,
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.04)",
          border: isPlaying ? "1px solid rgba(0, 242, 254, 0.2)" : "1px solid rgba(255, 42, 133, 0.35)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
        }}
        title={isPlaying ? "Pause Automatic Slides" : "Resume Automatic Slides"}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <motion.i
          whileHover={{ scale: 1.18 }}
          className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
          style={{
            color: isPlaying ? "#00f2fe" : "#ff2a85",
            fontSize: "0.62rem",
            filter: isPlaying
              ? "drop-shadow(0 0 3px rgba(0, 242, 254, 0.4))"
              : "drop-shadow(0 0 3px rgba(255, 42, 133, 0.5))",
          }}
        />
      </motion.button>

      <span className="text-white text-opacity-20 user-select-none position-relative" style={{ fontSize: "0.62rem", zIndex: 2 }}>|</span>

      {/* Slide Indicators Track - Cyber HUD Notches */}
      <div
        className="d-flex mx-2 align-items-center gap-1 p-1 py-0.5 rounded-pill position-relative"
        style={{
          zIndex: 2,
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(0, 242, 254, 0.15)",
          boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.7)",
        }}
      >
        {Array.from({ length: totalSlides }).map((_, idx) => {
          const isActive = currentSlide === idx;
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              whileHover={{ scale: 1.2, y: -1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="btn p-0 border-0 d-flex align-items-center mx-0.5"
              aria-label={`Jump to slide ${idx + 1}`}
            >
              <div
                style={{
                  width: isActive ? "15px" : "4.5px",
                  height: "4.5px",
                  borderRadius: "1px",
                  transform: "skewX(-24deg)",
                  background: isActive
                    ? "linear-gradient(90deg, #00f2fe 0%, #38f9d7 100%)"
                    : "rgba(255, 255, 255, 0.22)",
                  border: isActive
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: isActive
                    ? "0 0 8px rgba(0, 242, 254, 0.8), 0 0 3px #00f2fe"
                    : "none",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Slide Counter Telemetry Badge */}
      <motion.div
        whileHover={{ scale: 1.05, borderColor: "rgba(0, 242, 254, 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="d-flex mx-2 font-outfit justify-content-center align-items-center px-1.5 py-0.5 rounded position-relative user-select-none p-1"
        style={{
          zIndex: 2,
          background: "rgba(0, 242, 254, 0.06)",
          border: "1px solid rgba(0, 242, 254, 0.18)",
          fontSize: "0.45rem",
          letterSpacing: "0.08em",
          cursor: "default",
          width: 35,
        }}
      >
        <span style={{ color: "#00f2fe", fontWeight: 700 }}>0{currentSlide + 1}</span>
        <span className="text-white text-opacity-30 mx-0.5">/</span>
        <span className="text-light text-opacity-60">0{totalSlides}</span>
      </motion.div>

      {/* Right Chevron Button */}
      <motion.button
        type="button"
        onClick={handleNext}
        whileHover={{
          scale: 1.15,
          x: 1,
          backgroundColor: "rgba(0, 242, 254, 0.14)",
          borderColor: "rgba(0, 242, 254, 0.75)",
          boxShadow: "0 0 8px rgba(0, 242, 254, 0.45)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="btn rounded-circle p-0 d-flex align-items-center justify-content-center position-relative"
        style={{
          width: "22px",
          height: "22px",
          flexShrink: 0,
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(0, 242, 254, 0.25)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 1px 4px rgba(0, 0, 0, 0.4)",
        }}
        aria-label="Next Slide"
        title="Next Slide"
      >
        <motion.i
          whileHover={{ scale: 1.15 }}
          className="bi bi-chevron-right"
          style={{ color: "#00f2fe", fontSize: "0.62rem", filter: "drop-shadow(0 0 3px rgba(0, 242, 254, 0.4))" }}
        />
      </motion.button>
    </div>
  );
}
