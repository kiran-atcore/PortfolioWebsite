"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SlideTelemetryHUD from "./ui/SlideTelemetryHUD";
import AboutControls from "./about/AboutControls";
import ExperienceControls from "./experience/ExperienceControls";
import ChatBox from "./chat/ChatBox";
import { subscribeSlideState, SlideStatePayload, publishSlideSelect } from "@/lib/slideEvents";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCanvasSection, setIsCanvasSection] = useState(false);

  useEffect(() => {
    const unsub = subscribeSlideState((data: SlideStatePayload) => {
      setCurrentSlide(data.currentSlide);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsCanvasSection(entries[0].isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    const attach = () => {
      const el =
        document.getElementById("skills-cards-viewport") ||
        document.getElementById("contact-message-section");
      if (el) observer.observe(el);
    };

    attach();
    const timer = setTimeout(attach, 400);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  // Force scroll position to the top on page load/reload and route navigation,
  // and lock html/body scrolling on single-screen viewport pages (home, about, experience, projects)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const isViewportLocked =
        pathname === "/" ||
        pathname === "/about" ||
        pathname === "/experience" ||
        pathname === "/projects";

      if (isViewportLocked) {
        document.documentElement.classList.add("viewport-locked");
        document.body.classList.add("viewport-locked");
      } else {
        document.documentElement.classList.remove("viewport-locked");
        document.body.classList.remove("viewport-locked");
      }

      const raf = requestAnimationFrame(() => {
        setScrolled(false);
        setScrollProgress(0);
        setIsProgressHovered(false);
      });
      return () => {
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove("viewport-locked");
        document.body.classList.remove("viewport-locked");
      };
    }
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = 0;
    let idleTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY <= 10) {
        setIsProgressHovered(false);
      }

      // Compute scroll percentage
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, Math.round((currentScrollY / totalHeight) * 100))
        );
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      // Auto-minimize slightly on rapid downward scroll
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
      lastScrollY = currentScrollY;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsMinimized(false), 1400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(idleTimer);
    };
  }, [pathname]);

  const navTabs = [
    { href: "/", label: "Home", icon: "bi-house-door" },
    { href: "/about", label: "About", icon: "bi-person" },
    { href: "/experience", label: "Experience", icon: "bi-briefcase" },
    { href: "/projects", label: "Projects", icon: "bi-code-slash" },
    { href: "/skills", label: "Skills", icon: "bi-cpu" },
    { href: "/contact", label: "Contact", icon: "bi-chat-dots" },
  ];

  const handleDockMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
    e.currentTarget.style.setProperty("--mouse-active", "1");
  };

  const handleDockMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mouse-active", "0");
    e.currentTarget.style.setProperty("--mouse-x", "-9999px");
    e.currentTarget.style.setProperty("--mouse-y", "-9999px");
    setHoveredTab(null);
  };

  return (
    <>
      {/* Fixed Top Brand Ribbon */}
      <header
        className={`fixed-top position-fixed ${scrolled
          ? "py-2 navbar-top-scrolled"
          : "py-3 bg-transparent border-transparent"
          }`}
        style={{
          zIndex: 1040,
          background: scrolled
            ? "rgba(3, 8, 20, 0.82)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0, 242, 254, 0.16)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(0, 242, 254, 0.05)"
            : "none",
          transition: "background 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, padding 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center position-relative">
          <Link
            className="text-decoration-none d-inline-flex align-items-center navbar-k-logo-link"
            href="/"
            aria-label="Home"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                if (currentSlide !== 0) {
                  publishSlideSelect(0);
                }
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            }}
          >
            <div className="k-emblem-wrapper">
              <Image
                src="/k-logo-new.png"
                alt="Kiran Chand"
                width={36}
                height={40}
                priority
                className="k-emblem-img"
              />
            </div>
          </Link>
          {/* Right Header Navigation Elements & Extreme Right Progress Indicator */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {pathname === "/" && <SlideTelemetryHUD />}
            {(pathname === "/about" || pathname.startsWith("/about")) && <AboutControls />}
            {pathname === "/experience" && <ExperienceControls />}

            {/* Extreme Right Cyber Scroll Progress Indicator (Only for detailed spec decks) */}
            {(pathname.startsWith("/projects/") || pathname.startsWith("/experience/")) && (
              <button
                type="button"
                disabled={scrollProgress === 0}
                onClick={(e) => {
                  if (scrollProgress > 0) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsProgressHovered(false);
                    e.currentTarget.blur();
                  }
                }}
                onMouseEnter={() => setIsProgressHovered(true)}
                onMouseLeave={() => setIsProgressHovered(false)}
                onBlur={() => setIsProgressHovered(false)}
                className="navbar-scroll-progress-btn btn p-0 border-0 d-inline-flex align-items-center justify-content-center position-relative flex-shrink-0"
                aria-label={
                  scrollProgress > 0
                    ? `Scroll progress: ${scrollProgress}%. Click to scroll to top.`
                    : "Scroll progress: 0% (Inactive)"
                }
                title={
                  scrollProgress > 0
                    ? `Page Scroll: ${scrollProgress}% (Click to return to top)`
                    : "Scroll progress: 0% (Inactive)"
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background:
                    scrollProgress > 0
                      ? "rgba(6, 14, 28, 0.7)"
                      : "rgba(4, 9, 20, 0.4)",
                  border:
                    scrollProgress > 0
                      ? "1px solid rgba(0, 242, 254, 0.22)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow:
                    scrollProgress > 0 && isProgressHovered
                      ? "0 0 14px rgba(0, 242, 254, 0.4), inset 0 0 8px rgba(0, 242, 254, 0.15)"
                      : "none",
                  opacity: scrollProgress > 0 ? 1 : 0.35,
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: scrollProgress > 0 ? "pointer" : "not-allowed",
                }}
              >
                {/* Circular SVG Ring */}
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  className="position-absolute top-0 start-0"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  {/* Background Ring Track */}
                  <circle
                    cx="17"
                    cy="17"
                    r="13"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="2.5"
                  />
                  {/* Foreground Active Progress Ring */}
                  <circle
                    cx="17"
                    cy="17"
                    r="13"
                    fill="transparent"
                    stroke="#00f2fe"
                    strokeWidth="2.5"
                    strokeDasharray={81.68}
                    strokeDashoffset={81.68 - (scrollProgress / 100) * 81.68}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.12s ease-out",
                      filter:
                        scrollProgress > 0
                          ? "drop-shadow(0 0 3px #00f2fe)"
                          : "none",
                      opacity: scrollProgress > 0 ? 1 : 0,
                    }}
                  />
                </svg>

                {/* Center Content: Monospace Percentage or Up Arrow on Hover */}
                <span
                  className="position-relative font-mono fw-bold d-inline-flex align-items-center justify-content-center"
                  style={{
                    fontSize:
                      scrollProgress > 0 && isProgressHovered
                        ? "0.72rem"
                        : "0.5rem",
                    color:
                      scrollProgress > 0
                        ? isProgressHovered
                          ? "#00f2fe"
                          : "rgba(255, 255, 255, 0.85)"
                        : "rgba(255, 255, 255, 0.3)",
                    letterSpacing: "-0.02em",
                    zIndex: 1,
                    userSelect: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {scrollProgress > 0 && isProgressHovered ? (
                    <i className="bi bi-arrow-up" style={{ strokeWidth: "1px" }} />
                  ) : (
                    `${scrollProgress}%`
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Scroll to Top Arrow - Visible when in canvas/bottom section (Skills or Contact) */}
          <AnimatePresence>
            {isCanvasSection && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 242, 254, 0.2)", borderColor: "rgba(0, 242, 254, 0.6)", boxShadow: "0 0 10px rgba(0, 242, 254, 0.3)" }}
                whileTap={{ scale: 0.9, backgroundColor: "rgba(0, 242, 254, 0.3)" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="btn btn-sm d-flex align-items-center justify-content-center position-absolute end-0 top-50 translate-middle-y me-3 me-md-4"
                style={{
                  width: "30px",
                  height: "30px",
                  background: "rgba(0, 242, 254, 0.1)",
                  border: "1px solid rgba(0, 242, 254, 0.3)",
                  color: "#00f2fe",
                  borderRadius: "50%",
                  zIndex: 2000,
                }}
                aria-label="Scroll to top"
              >
                <i className="bi bi-arrow-up" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Hairline Laser Scroll Progress Line at Bottom of Header */}
        {pathname.startsWith("/projects/") && (
          <div
            className="position-absolute bottom-0 start-0 pe-none"
            style={{
              height: "1.5px",
              width: `${scrollProgress}%`,
              background: "linear-gradient(90deg, transparent, #00f2fe 70%, #ffffff)",
              boxShadow: "0 0 10px rgba(0, 242, 254, 0.9)",
              transition: "width 0.1s ease-out",
              opacity: scrolled ? 1 : 0,
              zIndex: 1,
            }}
          />
        )}
      </header>

      {/* Floating Projector Hint Note */}
      <AnimatePresence>
        {pathname === "/" && currentSlide === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="position-fixed start-50 translate-middle-x text-center pointer-events-none user-select-none"
            style={{
              bottom: "calc(max(1.25rem, env(safe-area-inset-bottom, 1.25rem)) + 52px)",
              zIndex: 1040,
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="instruction font-outfit text-uppercase"
              style={{
                fontSize: "0.41rem",
                letterSpacing: "0.2rem",
                color: "rgba(255, 255, 255, 0.65)",
                textShadow: "0 0 10px rgba(0, 245, 255, 0.4)",
              }}
            >
              Tap the projector to change
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Tab Navigation Dock */}
      <nav
        className={`floating-dock-container ${isMinimized ? "dock-minimized" : ""}`}
        aria-label="Bottom tab navigation"
      >
        <div
          className="floating-dock"
          onMouseMove={handleDockMouseMove}
          onMouseLeave={handleDockMouseLeave}
        >
          {/* Interactive Mouse-Following Shining Border Beam & Interior Spotlight */}
          <div className="floating-dock-border-shine" aria-hidden="true" />
          <div className="floating-dock-spotlight" aria-hidden="true" />

          {navTabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <div key={tab.href} className="position-relative d-inline-flex align-items-center">
                <Link
                  href={tab.href}
                  scroll={false}
                  className={`dock-item ${isActive ? "active" : ""} font-syncopate`}
                  onMouseEnter={() => setHoveredTab(tab.href)}
                  onMouseLeave={() => setHoveredTab(null)}
                  aria-label={tab.label}
                  style={{ fontSize: '0.5rem', }}
                  onClick={(e) => {
                    if (tab.href === "/" && pathname === "/") {
                      e.preventDefault();
                      if (currentSlide !== 0) {
                        publishSlideSelect(0);
                      }
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }
                  }}
                >
                  {/* Morphing Sliding Cyber Active Pill */}
                  {isActive && (
                    <motion.span
                      layoutId="activeDockPill"
                      className="dock-active-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  <i className={`bi ${tab.icon} fs-6`}></i>
                  <span className="dock-label">{tab.label}</span>
                  {isActive && <span className="dock-beacon ms-1" aria-hidden="true" />}
                </Link>

                {/* Floating Micro Tooltip */}
                <AnimatePresence>
                  {hoveredTab === tab.href && !isActive && (
                    <motion.div
                      className="dock-tooltip"
                      initial={{ opacity: 0, y: 6, scale: 0.92, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, y: 4, scale: 0.92, x: "-50%" }}
                      transition={{ duration: 0.15 }}
                    >
                      <span style={{ fontSize: '0.5rem', letterSpacing: 1, }} className="font-outfit">{tab.label}</span>
                      <div className="dock-tooltip-arrow" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Floating Bottom-Right Personalized AI Chatbot */}
      <ChatBox isMinimized={isMinimized} />
    </>
  );
}
