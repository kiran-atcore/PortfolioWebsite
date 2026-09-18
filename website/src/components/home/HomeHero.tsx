"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { PERSONAL_INFO } from "../../data/portfolioData";
import HeroCardGrid from "./HeroCardGrid";
import HomeOverview from "./HomeOverview";
import HomeTelemetry from "./HomeTelemetry";
import HomePrinciples from "./HomePrinciples";
import HomeConnect from "./HomeConnect";
import CardDetailModal from "./CardDetailModal";
import { HERO_CARDS, HeroCardData } from "@/data/heroCardsData";
import { publishSlideState, subscribeSlideSelect, subscribeSlideRequest } from "@/lib/slideEvents";
import CyberFlickerTitle from "../ui/CyberFlickerTitle";

export default function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0); // 0 = Hero 1, 1 = Hero 2, 2 = Overview 3, 3 = Overview 4, 4 = Telemetry 5, 5 = Principles 6, 6 = Connect 7
  const [selectedHeroCard, setSelectedHeroCard] = useState<HeroCardData | null>(null);
  const [isReleased, setIsReleased] = useState(false);
  const [isExitingToFooter, setIsExitingToFooter] = useState(false);
  const [isExitingSlide2, setIsExitingSlide2] = useState(false);
  const [isExitingSlide4, setIsExitingSlide4] = useState(false);
  const [isExitingSlide5, setIsExitingSlide5] = useState(false);
  const [isExitingSlide6, setIsExitingSlide6] = useState(false);
  const [isExitingSlide7, setIsExitingSlide7] = useState(false);
  const [isBgSlidingUp, setIsBgSlidingUp] = useState(false);
  const [isContentsRevealed, setIsContentsRevealed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const isTransitioning = useRef(false);
  const isScrollCooldown = useRef(false);
  const lastWheelTime = useRef(0);
  const touchStartY = useRef(0);

  const isDesktop = windowWidth >= 992;

  // Phase-by-phase transition: Slide 2 -> Slide 3
  // 1) outro animation of slide 2 (~500ms)
  // 2) make the background slide up over static hero (linear speed: 0.55s)
  // 3) then the contents are revealed
  const transitionSlide2To3 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 2 outro - triggers HeroCardGrid's holographic glitch flicker
    setIsExitingSlide2(true);
    setTimeout(() => {
      // Phase 2: Background slides up over static hero with linear speed (0.55s)
      setIsBgSlidingUp(true);
      setTimeout(() => {
        // Phase 3: Reveal Slide 3 contents
        setCurrentSlide(2);
        setIsExitingSlide2(false);
        setIsContentsRevealed(true);
        setTimeout(() => {
          isTransitioning.current = false;
        }, 300);
      }, 550);
    }, 500);
  };

  // Phase-by-phase reverse transition: Slide 3 -> Slide 2
  const transitionSlide3To2 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 3 contents exit
    setIsContentsRevealed(false);
    setTimeout(() => {
      // Phase 2: Overview background slides down (0.55s)
      setIsBgSlidingUp(false);
      setTimeout(() => {
        // Phase 3: Slide 2 cards and text re-enter
        setCurrentSlide(1);
        setIsExitingSlide2(false);
        setTimeout(() => {
          isTransitioning.current = false;
        }, 300);
      }, 550);
    }, 200);
  };

  // Phase-by-phase transition: Slide 4 -> Slide 5 (Telemetry Cyber De-cloak)
  const transitionSlide4To5 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 4 outro
    setIsExitingSlide4(true);
    setTimeout(() => {
      // Phase 2: Switch to Slide 5 and let its cyber intro variants trigger
      setCurrentSlide(4);
      setIsExitingSlide4(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  // Phase-by-phase reverse transition: Slide 5 -> Slide 4
  const transitionSlide5To4 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 5 outro
    setIsExitingSlide5(true);
    setTimeout(() => {
      // Phase 2: Switch back to Slide 4
      setCurrentSlide(3);
      setIsExitingSlide5(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  // Phase-by-phase transition: Slide 5 -> Slide 6 (Principles)
  const transitionSlide5To6 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 5 outro
    setIsExitingSlide5(true);
    setTimeout(() => {
      // Phase 2: Switch to Slide 6
      setCurrentSlide(5);
      setIsExitingSlide5(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  // Phase-by-phase reverse transition: Slide 6 -> Slide 5
  const transitionSlide6To5 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 6 outro
    setIsExitingSlide6(true);
    setTimeout(() => {
      // Phase 2: Switch back to Slide 5
      setCurrentSlide(4);
      setIsExitingSlide6(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  // Phase-by-phase transition: Slide 6 -> Slide 7 (Connect)
  const transitionSlide6To7 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 6 outro
    setIsExitingSlide6(true);
    setTimeout(() => {
      // Phase 2: Switch to Slide 7
      setCurrentSlide(6);
      setIsExitingSlide6(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  // Phase-by-phase reverse transition: Slide 7 -> Slide 6
  const transitionSlide7To6 = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isScrollCooldown.current = true;
    // Phase 1: Slide 7 outro
    setIsExitingSlide7(true);
    setTimeout(() => {
      // Phase 2: Switch back to Slide 6
      setCurrentSlide(5);
      setIsExitingSlide7(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 750);
    }, 450);
  };

  const handleSlideJump = (index: number) => {
    if (index !== currentSlide && !isExitingToFooter && !isTransitioning.current) {
      if (currentSlide === 3 && index === 4) {
        transitionSlide4To5();
        return;
      }
      if (currentSlide === 4 && index === 3) {
        transitionSlide5To4();
        return;
      }
      if (currentSlide === 4 && index === 5) {
        transitionSlide5To6();
        return;
      }
      if (currentSlide === 5 && index === 4) {
        transitionSlide6To5();
        return;
      }
      if (currentSlide === 5 && index === 6) {
        transitionSlide6To7();
        return;
      }
      if (currentSlide === 6 && index === 5) {
        transitionSlide7To6();
        return;
      }
      if (currentSlide < 2 && index >= 2) {
        if (index === 2) {
          transitionSlide2To3();
        } else {
          setIsBgSlidingUp(true);
          setIsContentsRevealed(true);
          setCurrentSlide(index);
          setIsReleased(false);
        }
      } else if (currentSlide >= 2 && index < 2) {
        if (index === 1) {
          transitionSlide3To2();
        } else {
          setIsBgSlidingUp(false);
          setIsContentsRevealed(false);
          setCurrentSlide(0);
          setIsReleased(false);
        }
      } else {
        setCurrentSlide(index);
        setIsReleased(false);
      }
    }
  };

  useEffect(() => {
    publishSlideState({ currentSlide, totalSlides: 7 });
  }, [currentSlide]);

  useEffect(() => {
    const unsubSelect = subscribeSlideSelect((targetIndex) => {
      handleSlideJump(targetIndex);
    });
    const unsubRequest = subscribeSlideRequest(() => {
      publishSlideState({ currentSlide, totalSlides: 7 });
    });
    return () => {
      unsubSelect();
      unsubRequest();
    };
  }, [currentSlide, isExitingToFooter]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 0);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Disable background screen scroll when modal is opened
      if (document.body.classList.contains("modal-open")) {
        const isInsideModalScroll = (e.target as HTMLElement)?.closest?.(".cyber-modal-body");
        if (!isInsideModalScroll) {
          e.preventDefault();
        }
        return;
      }

      // 1. Filter out horizontal swipes and tiny residual momentum events (trackpad sticking bug)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (!isReleased) e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 8) {
        if (!isReleased) e.preventDefault();
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastWheelTime.current;
      lastWheelTime.current = now;

      // 2. If released downstream to footer
      if (isReleased) {
        if (e.deltaY < -15 && window.scrollY < 80) {
          e.preventDefault();
          window.scrollTo(0, 0);
          setIsReleased(false);
          setIsExitingToFooter(false);
          setIsBgSlidingUp(true);
          setIsContentsRevealed(true);
          setCurrentSlide(6); // Catch re-entry into Slide 7: Connect
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        }
        return;
      }

      e.preventDefault();
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }

      // 3. New gesture detection (pause > 250ms)
      if (timeDiff > 250) {
        isScrollCooldown.current = false;
      }

      // 4. Lockout during transitions or continuous scroll gesture
      if (isTransitioning.current || isScrollCooldown.current) {
        return;
      }

      // 5. Guaranteed single-slide progression across all 7 slides
      if (e.deltaY > 15) {
        if (currentSlide === 0) {
          setCurrentSlide(1);
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 1) {
          // Slide 2 -> Slide 3: Phased sequence (outro -> bg slide -> content reveal)
          transitionSlide2To3();
        } else if (currentSlide === 2) {
          // Slide 3 -> Slide 4 (Overview Toolkit & Resume)
          setCurrentSlide(3);
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 3) {
          // Slide 4 -> Slide 5 (Phased cyber transition to Telemetry)
          transitionSlide4To5();
        } else if (currentSlide === 4) {
          // Slide 5 -> Slide 6 (Phased cyber transition to Principles)
          transitionSlide5To6();
        } else if (currentSlide === 5) {
          // Slide 6 -> Slide 7 (Phased cyber transition to Connect)
          transitionSlide6To7();
        } else if (currentSlide === 6 && !isExitingToFooter) {
          // Slide 7 -> Release downstream to #site-footer
          setIsExitingToFooter(true);
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            setIsReleased(true);
            setIsExitingToFooter(false);
            isTransitioning.current = false;
            document.getElementById("site-footer")?.scrollIntoView({ behavior: "smooth" });
          }, 750);
        }
      } else if (e.deltaY < -15) {
        if (currentSlide === 6) {
          // Slide 7 -> Slide 6 (Connect -> Principles)
          transitionSlide7To6();
        } else if (currentSlide === 5) {
          // Slide 6 -> Slide 5 (Principles -> Telemetry)
          transitionSlide6To5();
        } else if (currentSlide === 4) {
          // Slide 5 -> Slide 4 (Phased reverse cyber transition)
          transitionSlide5To4();
        } else if (currentSlide === 3) {
          // Slide 4 -> Slide 3
          setCurrentSlide(2);
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 2) {
          // Slide 3 -> Slide 2: Phased reverse sequence
          transitionSlide3To2();
        } else if (currentSlide === 1) {
          // Slide 2 -> Slide 1
          setCurrentSlide(0);
          isTransitioning.current = true;
          isScrollCooldown.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (document.body.classList.contains("modal-open")) {
        return;
      }
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (document.body.classList.contains("modal-open")) {
        const isInsideModalScroll = (e.target as HTMLElement)?.closest?.(".cyber-modal-body");
        if (!isInsideModalScroll) {
          e.preventDefault();
        }
        return;
      }
      if (isReleased) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (document.body.classList.contains("modal-open")) {
        return;
      }
      if (isTransitioning.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // 1. Re-entering from downstream section
      if (isReleased) {
        if (deltaY < -24 && window.scrollY < 80) {
          window.scrollTo(0, 0);
          setIsReleased(false);
          setIsExitingToFooter(false);
          setIsBgSlidingUp(true);
          setIsContentsRevealed(true);
          setCurrentSlide(6); // Re-entry into Slide 7: Connect
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        }
        return;
      }

      // 2. Calibrated touch sensitivity threshold (24px)
      if (Math.abs(deltaY) < 24) return;

      // 3. Guaranteed single-slide progression
      if (deltaY > 0) {
        if (currentSlide === 0) {
          setCurrentSlide(1);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 1) {
          transitionSlide2To3();
        } else if (currentSlide === 2) {
          setCurrentSlide(3);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 3) {
          transitionSlide4To5();
        } else if (currentSlide === 4) {
          transitionSlide5To6();
        } else if (currentSlide === 5) {
          transitionSlide6To7();
        } else if (currentSlide === 6 && !isExitingToFooter) {
          setIsExitingToFooter(true);
          isTransitioning.current = true;
          setTimeout(() => {
            setIsReleased(true);
            setIsExitingToFooter(false);
            isTransitioning.current = false;
            document.getElementById("site-footer")?.scrollIntoView({ behavior: "smooth" });
          }, 750);
        }
      } else {
        if (currentSlide === 6) {
          transitionSlide7To6();
        } else if (currentSlide === 5) {
          transitionSlide6To5();
        } else if (currentSlide === 4) {
          transitionSlide5To4();
        } else if (currentSlide === 3) {
          setCurrentSlide(2);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else if (currentSlide === 2) {
          transitionSlide3To2();
        } else if (currentSlide === 1) {
          setCurrentSlide(0);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, isReleased, isExitingToFooter, isExitingSlide2, isExitingSlide4, isExitingSlide5, isExitingSlide6, isExitingSlide7, isBgSlidingUp, isContentsRevealed]);

  // High-Tech Cybernetic Text Intro Variants
  const textContainerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08
      }
    },
    exit: {
      opacity: 0,
      y: -28,
      filter: "blur(8px)",
      transition: { duration: 0.45, ease: "easeIn" }
    }
  };

  const chipVariants: Variants = {
    initial: { opacity: 0, y: -8, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const roleVariants: Variants = {
    initial: { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const titleVariants: Variants = {
    initial: { opacity: 0, y: 24, scale: 0.94, filter: "blur(14px)" },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const taglineVariants: Variants = {
    initial: { opacity: 0, y: 16, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const descVariants: Variants = {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const buttonsVariants: Variants = {
    initial: { opacity: 0, y: 16, scale: 0.94 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const renderHeroTextContent = (isCentered = false) => (
    <div className={`w-100 d-flex flex-column ${isCentered ? "align-items-center text-center" : "align-items-start text-start"}`}>
      <motion.div
        variants={chipVariants}
        className="d-inline-flex align-items-center text-nowrap gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-2 mb-lg-2"
        style={{ flexShrink: 0, willChange: "transform, opacity" }}
      >
        <span className="pulse-cyan" aria-hidden="true"></span>
        <span className="text-light fw-medium font-syne tracking-wide py-2" style={{ fontSize: "0.65rem", letterSpacing: "0.22em", lineHeight: 1, whiteSpace: "nowrap" }}>
          {"// STATUS: OPEN TO SWE & AI ROLES"}
        </span>
      </motion.div>

      <motion.div variants={roleVariants} className="font-syne text-uppercase fw-semibold tracking-scifi hero-role-text mb-2">
        Full Stack Engineer &bull; Applied AI Architect
      </motion.div>

      <CyberFlickerTitle
        text={PERSONAL_INFO.name}
        variants={titleVariants}
        className="font-bruno display-4 text-uppercase text-white tracking-scifi cyber-title-glow my-2 my-sm-2 mb-lg-2 px-5 px-md-0 py-md-4 py-lg-2"
      />

      <motion.h2 variants={taglineVariants} className="font-space-grotesk h6 text-light text-opacity-90 fw-normal tracking-wide lh-base mb-2 mb-lg-3 pe-lg-3">
        Architecting Scalable Web Ecosystems &amp; Real-Time Intelligence
      </motion.h2>

      <motion.p variants={descVariants} className="mt-2 mt-lg-4 font-outfit text-light text-opacity-50 mb-3 pe-lg-4" style={{ fontSize: "0.6rem", lineHeight: "1.75", letterSpacing: "0.035em", maxWidth: isCentered ? "680px" : "100%" }}>
        Engineering high-throughput backends (<span style={{ color: "#00f2fe" }}>Django REST, WebSockets, AWS</span>) paired with reactive user interfaces and sub-second applied AI inference pipelines.
      </motion.p>

      <motion.div variants={buttonsVariants} className={`font-syncopate d-flex flex-wrap gap-3 mt-2 mt-lg-3 mb-1 ${isCentered ? "justify-content-center" : "justify-content-start"}`}>
        <Link href="/projects" className="btn btn-neon-cyan px-4 py-2 rounded-pill tracking-wider text-uppercase" style={{ fontSize: "0.5rem" }}>
          <i className="bi bi-cpu-fill me-2"></i> Explore Projects &rarr;
        </Link>
        <Link href="/contact" className="btn btn-cyber-glass px-4 py-2 rounded-pill tracking-wider text-uppercase" style={{ fontSize: "0.5rem" }}>
          Let&apos;s Connect
        </Link>
      </motion.div>
    </div>
  );

  return (
    <section id="hero-intro" className="hero-fusion-section w-100 position-relative">
      {/* 1. Static Hero Background (always at base) */}
      <div className="hero-fusion-overlay" aria-hidden="true"></div>

      {/* 2. Dragging Overview Background Layer (sweeps up in Phase 2 at linear speed) */}
      <motion.div
        className="overview-bg-layer"
        initial={{ y: "100%" }}
        animate={{ y: isBgSlidingUp ? "0%" : "100%" }}
        transition={{ duration: 0.55, ease: "linear" }}
        aria-hidden="true"
      />

      {/* 3. Hero Slides (Slide 1 & Slide 2) */}
      <AnimatePresence>
        {(currentSlide < 2 || isExitingSlide2) && (
          <motion.div
            key="hero-slides-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="container position-relative h-100 d-flex flex-column justify-content-center hero-slides-container"
            style={{ zIndex: 2 }}
          >
            {isDesktop ? (
              <div className="row w-100 align-items-center m-0 position-relative">
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
                  className={`p-0 ${currentSlide === 0
                    ? "col-12 d-flex flex-column align-items-center text-center hero-slide-1-text"
                    : "col-lg-6 d-flex flex-column align-items-start text-start hero-slide-2-text"
                    }`}
                >
                  <AnimatePresence>
                    {!isExitingSlide2 && (
                      <motion.div
                        key="desktop-text-block"
                        variants={textContainerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-100"
                      >
                        {renderHeroTextContent(currentSlide === 0)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div
                  className="col-lg-6 position-absolute end-0 top-0 bottom-0 d-flex align-items-center justify-content-end p-0"
                  style={{ pointerEvents: currentSlide === 1 && !isExitingSlide2 ? "auto" : "none" }}
                >
                  <AnimatePresence>
                    {currentSlide === 1 && !isExitingSlide2 && (
                      <motion.div
                        key="desktop-cards-panel"
                        initial={{ opacity: 0, x: 60, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.85 } }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="w-100 d-flex justify-content-end"
                      >
                        <HeroCardGrid
                          selectedCard={selectedHeroCard}
                          onSelectCard={setSelectedHeroCard}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="row w-100 h-100 align-items-center justify-content-center text-center m-0">
                <AnimatePresence mode="wait">
                  {currentSlide === 0 ? (
                    <motion.div
                      key="mobile-text"
                      variants={textContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="col-12 p-0 d-flex flex-column align-items-center hero-slide-1-text"
                    >
                      {renderHeroTextContent(true)}
                    </motion.div>
                  ) : (
                    !isExitingSlide2 && (
                      <motion.div
                        key="mobile-cards"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.85 } }}
                        transition={{ duration: 0.75 }}
                        className="col-12 p-0 d-flex align-items-center justify-content-center"
                      >
                        <HeroCardGrid
                          selectedCard={selectedHeroCard}
                          onSelectCard={setSelectedHeroCard}
                        />
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Overview Slides (Slide 3 & Slide 4 - Revealed in Phase 3) */}
      <AnimatePresence>
        {(currentSlide === 2 || currentSlide === 3) && isContentsRevealed && (
          <motion.div
            key="overview-slides-wrapper"
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.35, ease: "easeInOut" } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="container position-relative h-100 d-flex flex-column overview-slides-container"
            style={{ zIndex: 4 }}
          >
            <HomeOverview
              overviewSlide={currentSlide - 2}
              isExiting={isExitingSlide4}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Telemetry Slide (Slide 5 - Single slide on same static background) */}
      <AnimatePresence>
        {currentSlide === 4 && isContentsRevealed && (
          <motion.div
            key="telemetry-slides-wrapper"
            initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.35, ease: "easeInOut" } }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="container position-relative h-100 d-flex flex-column telemetry-slides-container"
            style={{ zIndex: 4 }}
          >
            <HomeTelemetry
              isExiting={isExitingSlide5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Principles Slide (Slide 6 - Single slide on same static background) */}
      <AnimatePresence>
        {currentSlide === 5 && isContentsRevealed && (
          <motion.div
            key="principles-slides-wrapper"
            initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.35, ease: "easeInOut" } }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="container position-relative h-100 d-flex flex-column principles-slides-container"
            style={{ zIndex: 4 }}
          >
            <HomePrinciples
              isExiting={isExitingSlide6}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Connect Slide (Slide 7 - Single slide on same static background) */}
      <AnimatePresence>
        {currentSlide === 6 && isContentsRevealed && (
          <motion.div
            key="connect-slides-wrapper"
            initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.35, ease: "easeInOut" } }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="container position-relative h-100 d-flex flex-column connect-slides-container"
            style={{ zIndex: 4 }}
          >
            <HomeConnect
              isExiting={isExitingToFooter || isExitingSlide7}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive 3D Card Detail Modal - Hoisted so window resize never unmounts it */}
      <CardDetailModal
        card={selectedHeroCard}
        allCards={HERO_CARDS}
        onClose={() => setSelectedHeroCard(null)}
        onSelectCard={(c) => setSelectedHeroCard(c)}
      />

    </section>
  );
}
