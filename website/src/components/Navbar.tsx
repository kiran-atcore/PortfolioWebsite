"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL_INFO } from "../data/portfolioData";
import SlideTelemetryHUD from "./ui/SlideTelemetryHUD";
import { subscribeSlideState, SlideStatePayload } from "@/lib/slideEvents";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const unsub = subscribeSlideState((data: SlideStatePayload) => {
      setCurrentSlide(data.currentSlide);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let idleTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimer);
    };
  }, []);

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
        className="fixed-top position-fixed py-3 bg-transparent border-transparent"
        style={{ zIndex: 1040 }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="text-decoration-none d-inline-flex align-items-center navbar-k-logo-link" href="/" aria-label="Home">
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
          <SlideTelemetryHUD />
        </div>
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
              className="font-outfit text-uppercase"
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
                  className={`dock-item ${isActive ? "active" : ""} font-syncopate`}
                  onMouseEnter={() => setHoveredTab(tab.href)}
                  onMouseLeave={() => setHoveredTab(null)}
                  aria-label={tab.label}
                  style={{ fontSize: '0.5rem', }}
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
    </>
  );
}
