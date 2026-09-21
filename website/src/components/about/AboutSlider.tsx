"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AboutSlidePhilosophy from "./AboutSlidePhilosophy";
import AboutSlideArchitecture from "./AboutSlideArchitecture";
import AboutSlideTelemetry from "./AboutSlideTelemetry";
import {
  publishAboutSlideState,
  subscribeAboutSlideAction,
  subscribeAboutSlideRequest,
} from "@/lib/slideEvents";

const BACKGROUNDS = [
  "/about-bg-minimal-1.jpg",
  "/about-bg-minimal-2.jpg",
  "/about-bg-minimal-3.jpg",
];

const SLIDE_COMPONENTS = [
  AboutSlidePhilosophy,
  AboutSlideArchitecture,
  AboutSlideTelemetry,
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: "easeInOut" as const },
  }),
};

export default function AboutSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlideRef = useRef(currentSlide);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const resetTimer = useCallback((active = isPlayingRef.current) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!active) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer(isPlaying);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, resetTimer]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % 3);
    resetTimer();
  }, [resetTimer]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
    resetTimer();
  }, [resetTimer]);

  const selectSlide = useCallback(
    (index: number) => {
      setDirection(index >= currentSlideRef.current ? 1 : -1);
      setCurrentSlide(index);
      resetTimer();
    },
    [resetTimer]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    publishAboutSlideState({ currentSlide, totalSlides: 3, isPlaying });
  }, [currentSlide, isPlaying]);

  useEffect(() => {
    const unsubAction = subscribeAboutSlideAction((action) => {
      if (action === "next") nextSlide();
      else if (action === "prev") prevSlide();
      else if (action === "togglePlay") togglePlay();
      else if (typeof action === "number") selectSlide(action);
    });

    const unsubReq = subscribeAboutSlideRequest(() => {
      publishAboutSlideState({
        currentSlide: currentSlideRef.current,
        totalSlides: 3,
        isPlaying: isPlayingRef.current,
      });
    });

    return () => {
      unsubAction();
      unsubReq();
    };
  }, [nextSlide, prevSlide, togglePlay, selectSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const ActiveSlideComponent = SLIDE_COMPONENTS[currentSlide];

  return (
    <section
      style={{ borderTop: "1px solid #ffffff5c" }}
      className="position-relative pt-3 pt-lg-2 w-100 h-100 d-flex flex-column justify-content-start align-items-center overflow-hidden"
    >
      {/* Dynamic Backgrounds with Smooth Crossfade */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        {BACKGROUNDS.map((bg, idx) => (
          <div
            key={idx}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              opacity: currentSlide === idx ? 1 : 0,
              transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Image
              src={bg}
              alt={`Slide Background ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-fit-cover"
              sizes="100vw"
              style={{
                filter: "brightness(0.8) contrast(1.1)",
              }}
            />
          </div>
        ))}
        {/* Lighter Cyber Vignette & Atmospheric Film */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at center, rgba(2, 4, 10, 0.22) 0%, rgba(2, 4, 10, 0.45) 75%, rgba(2, 4, 10, 0.75) 100%), linear-gradient(to bottom, rgba(4, 8, 16, 0.3) 0%, rgba(4, 8, 16, 0.08) 45%, rgba(4, 8, 16, 0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Slide Content with Directional Animation anchored near top below navbar */}
      <div className="position-relative w-100 d-flex flex-column align-items-center justify-content-start flex-grow-1 pt-2 pt-md-3" style={{ zIndex: 2 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-100 d-flex justify-content-center"
          >
            <ActiveSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
