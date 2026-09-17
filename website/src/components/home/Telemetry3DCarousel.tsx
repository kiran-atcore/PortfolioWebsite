"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export interface TelemetryMetric {
  value: string;
  label: string;
  detail: string;
  icon: string;
  badge: string;
  accent: string;
  progress: string;
}

interface Telemetry3DCarouselProps {
  metrics: TelemetryMetric[];
  isExiting?: boolean;
}

export default function Telemetry3DCarousel({
  metrics,
  isExiting = false,
}: Telemetry3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenTier, setScreenTier] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w >= 992) return "desktop";
      if (w >= 576) return "tablet";
      return "mobile";
    }
    return "desktop";
  });
  const [hasMounted, setHasMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Touch / Drag tracking refs
  const dragStartPos = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Responsive breakpoint tracking (<576 mobile, 576-991 tablet, >=992 desktop)
  useEffect(() => {
    setHasMounted(true);
    const checkViewport = () => {
      const w = window.innerWidth;
      if (w >= 992) {
        setScreenTier("desktop");
      } else if (w >= 576) {
        setScreenTier("tablet");
      } else {
        setScreenTier("mobile");
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const isDesktop = screenTier === "desktop";
  const isTablet = screenTier === "tablet";

  const total = metrics.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Horizontal Touch / Pointer Gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartPos.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartPos.current === null) return;
    const delta = dragStartPos.current - e.clientX;
    if (Math.abs(delta) > 35) {
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    isDragging.current = false;
    dragStartPos.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = (touchStartY.current ?? touchEndY) - touchEndY;

    // Trigger swipe if horizontal displacement exceeds 30px and dominates vertical motion
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Three.js Background Holographic Rotor Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 7;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Holographic Wireframe Cylindrical Cage (Rotor Drum)
    const cylGeom = new THREE.CylinderGeometry(3.2, 3.2, 1.8, 24, 4, true);
    const cylMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const cylinderCage = new THREE.Mesh(cylGeom, cylMat);
    rootGroup.add(cylinderCage);

    // 2. Dual Glowing Gyro Rings
    const ringGeom = new THREE.TorusGeometry(3.22, 0.02, 16, 64);
    const ringMatCyan = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const topRing = new THREE.Mesh(ringGeom, ringMatCyan);
    topRing.position.y = 0.9;
    topRing.rotation.x = Math.PI / 2;
    rootGroup.add(topRing);

    const ringMatMagenta = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const bottomRing = new THREE.Mesh(ringGeom, ringMatMagenta);
    bottomRing.position.y = -0.9;
    bottomRing.rotation.x = Math.PI / 2;
    rootGroup.add(bottomRing);

    // 3. Ambient Cyber Hologram Particles
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.8 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38f9d7,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particles);

    updateSize();
    window.addEventListener("resize", updateSize);

    let animId: number;
    let currentRotorAngle = (activeIndexRef.current * (Math.PI * 2)) / 4;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smoothly interpolate 3D rotor rotation to follow active index
      const targetAngle = (activeIndexRef.current * (Math.PI * 2)) / 4;
      currentRotorAngle += (targetAngle - currentRotorAngle) * 0.08;

      // Always Upright wireframe cylinder rotating horizontally around Y-axis
      cylinderCage.rotation.set(0, 0, 0);
      topRing.position.set(0, 0.9, 0);
      topRing.rotation.set(Math.PI / 2, 0, 0);
      bottomRing.position.set(0, -0.9, 0);
      bottomRing.rotation.set(Math.PI / 2, 0, 0);

      rootGroup.rotation.y = -currentRotorAngle;
      rootGroup.rotation.x = 0.1;
      rootGroup.rotation.z = 0;
      camera.position.z = isDesktop ? 7 : isTablet ? 7.2 : 7.35;

      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
      cylGeom.dispose();
      cylMat.dispose();
      ringGeom.dispose();
      ringMatCyan.dispose();
      ringMatMagenta.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [screenTier]);

  // Compute 3D cylinder transform for each card (Always horizontal carousel)
  const getCardStyle = (index: number) => {
    // Relative displacement normalized to [-2, 1]
    let diff = (index - activeIndex) % total;
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    // Center active card
    if (diff === 0) {
      return {
        transform: "translate3d(-50%, -50%, 0px) rotateY(0deg) scale(1)",
        opacity: 1,
        zIndex: 10,
        filter: "blur(0px)",
        pointerEvents: "auto" as const,
      };
    } else if (diff === -1) {
      // Left card
      const sideOffset = isDesktop ? -310 : isTablet ? -255 : -215;
      const rotY = isDesktop ? 28 : isTablet ? 26 : 24;
      const scale = isDesktop ? 0.85 : isTablet ? 0.84 : 0.82;
      return {
        transform: `translate3d(calc(-50% + ${sideOffset}px), -50%, -140px) rotateY(${rotY}deg) scale(${scale})`,
        opacity: isDesktop ? 0.45 : isTablet ? 0.4 : 0.35,
        zIndex: 6,
        filter: "blur(1.5px)",
        pointerEvents: "auto" as const,
      };
    } else if (diff === 1) {
      // Right card
      const sideOffset = isDesktop ? 310 : isTablet ? 255 : 215;
      const rotY = isDesktop ? -28 : isTablet ? -26 : -24;
      const scale = isDesktop ? 0.85 : isTablet ? 0.84 : 0.82;
      return {
        transform: `translate3d(calc(-50% + ${sideOffset}px), -50%, -140px) rotateY(${rotY}deg) scale(${scale})`,
        opacity: isDesktop ? 0.45 : isTablet ? 0.4 : 0.35,
        zIndex: 6,
        filter: "blur(1.5px)",
        pointerEvents: "auto" as const,
      };
    } else {
      // Back card
      return {
        transform: "translate3d(-50%, -50%, -320px) rotateY(180deg) scale(0.65)",
        opacity: 0,
        zIndex: 1,
        filter: "blur(4px)",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <div
      className="telemetry-rotor-wrapper position-relative w-100 my-0"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "pan-y",
        userSelect: "none",
        minHeight: isDesktop ? "380px" : isTablet ? "370px" : "345px",
        marginTop: isDesktop ? "-16px" : "0px",
      }}
    >
      {/* 3D WebGL Canvas Layer (Three.js Wireframe Cylinder & Gyro) */}
      <canvas
        ref={canvasRef}
        className="telemetry-rotor-canvas position-absolute top-0 start-0 w-100 h-100"
        style={{ pointerEvents: "none", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* 3D Cylindrical Rotor Viewport (Always Horizontal) */}
      <div
        className="telemetry-rotor-viewport position-relative w-100 mx-auto"
        style={{
          perspective: isDesktop ? "1300px" : isTablet ? "1150px" : "950px",
          perspectiveOrigin: "50% 50%",
          height: isDesktop ? "320px" : isTablet ? "315px" : "290px",
          maxWidth: isDesktop ? "980px" : isTablet ? "720px" : "500px",
          zIndex: 3,
        }}
      >
        {metrics.map((metric, idx) => {
          const cardStyle = getCardStyle(idx);
          const isActive = idx === activeIndex;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="telemetry-rotor-card position-absolute top-50 start-50"
              style={{
                ...cardStyle,
                width: isDesktop ? "330px" : isTablet ? "320px" : "295px",
                maxWidth: isDesktop ? "350px" : isTablet ? "340px" : "315px",
                transition: hasMounted
                  ? "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.5s ease"
                  : "none",
                cursor: isActive ? "default" : "pointer",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`telemetry-card mt-4 h-100 rounded-4 position-relative d-flex flex-column justify-content-between overflow-hidden ${isActive ? "telemetry-card-active" : ""
                  }`}
                style={{
                  padding: isDesktop ? "1.4rem" : isTablet ? "1.2rem 1.3rem" : "1.05rem 1.15rem",
                  background: isActive ? "rgba(4, 9, 24, 0.88)" : "rgba(3, 7, 18, 0.72)",
                  backdropFilter: "blur(16px)",
                  border: isActive
                    ? `1px solid ${metric.accent}`
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive
                    ? `0 16px 36px rgba(0, 0, 0, 0.75), 0 0 28px ${metric.accent}35, inset 0 0 16px ${metric.accent}15`
                    : "0 10px 24px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.4s ease",
                }}
              >
                {/* Active Neon Accent Corner Indicator */}
                {isActive && (
                  <div
                    className="position-absolute top-0 end-0 px-2 py-0 font-space-grotesk"
                    style={{
                      letterSpacing: 1,
                      fontSize: isDesktop ? "0.55rem" : isTablet ? "0.54rem" : "0.52rem",
                      background: `${metric.accent}20`,
                      color: metric.accent,
                      borderBottomLeftRadius: "8px",
                      borderLeft: `1px solid ${metric.accent}50`,
                      borderBottom: `1px solid ${metric.accent}50`,
                    }}
                  >
                    ACTIVE // 0{idx + 1}
                  </div>
                )}

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2 mb-md-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: isDesktop ? "38px" : isTablet ? "36px" : "34px",
                        height: isDesktop ? "38px" : isTablet ? "36px" : "34px",
                        background: "rgba(3, 7, 18, 0.6)",
                        border: `1px solid ${metric.accent}45`,
                        color: metric.accent,
                        boxShadow: `0 0 12px ${metric.accent}30`,
                      }}
                    >
                      <i className={`bi ${metric.icon}`} style={{ fontSize: isDesktop ? "1.1rem" : isTablet ? "1.05rem" : "0.98rem" }}></i>
                    </div>
                    <span
                      className="badge rounded-pill font-space-grotesk px-2 py-1"
                      style={{
                        background: "rgba(3, 7, 18, 0.6)",
                        border: `1px solid ${metric.accent}35`,
                        color: metric.accent,
                        fontSize: isDesktop ? "0.62rem" : isTablet ? "0.6rem" : "0.58rem",
                        letterSpacing: 2,
                      }}
                    >
                      {metric.badge}
                    </span>
                  </div>

                  <div
                    className="font-orbitron display-6 fw-bold text-white mb-0 mb-md-1"
                    style={{
                      textShadow: isActive ? `0 0 24px ${metric.accent}60` : "none",
                      fontSize: isDesktop ? "2rem" : isTablet ? "1.85rem" : "1.75rem",
                    }}
                  >
                    {metric.value}
                  </div>

                  <h3
                    className="font-space-grotesk text-light mb-1 text-uppercase"
                    style={{ fontSize: isDesktop ? "1rem" : isTablet ? "0.90rem" : "0.80rem", letterSpacing: 3 }}
                  >
                    {metric.label}
                  </h3>

                  <p
                    className="font-outfit text-light text-opacity-70 mb-1"
                    style={{ fontSize: isDesktop ? "0.74rem" : isTablet ? "0.72rem" : "0.68rem", letterSpacing: 1, lineHeight: "1.3" }}
                  >
                    {metric.detail}
                  </p>
                </div>

                {/* Animated Benchmark Progress Bar */}
                <div className="telemetry-progress-track rounded-pill mt-1">
                  <div
                    className="telemetry-progress-bar rounded-pill"
                    style={{
                      width: isActive ? metric.progress : "0%",
                      background: `linear-gradient(90deg, ${metric.accent} 0%, #38f9d7 100%)`,
                      boxShadow: `0 0 10px ${metric.accent}80`,
                      transition: "width 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Horizontal Cyber Controls (Centered for all screens) */}
      <div
        className="d-flex justify-content-between align-items-center mt-2 mt-md-3 mx-auto px-2"
        style={{ zIndex: 4, position: "relative", maxWidth: isDesktop ? "420px" : isTablet ? "360px" : "305px" }}
      >
        {/* Left Cyber Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          className="btn btn-cyber-glass rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ width: isDesktop ? "38px" : isTablet ? "36px" : "34px", height: isDesktop ? "38px" : isTablet ? "36px" : "34px", fontSize: isDesktop ? "0.95rem" : isTablet ? "0.9rem" : "0.88rem" }}
          aria-label="Previous Metric"
          title="Previous Metric"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {/* Horizontal Rotor Angle Indicator Pills */}
        <div className="d-flex align-items-center gap-2">
          {metrics.map((m, idx) => {
            const isCurr = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="btn p-0 border-0 d-flex align-items-center"
                style={{ background: "transparent" }}
                aria-label={`Jump to metric ${m.label}`}
              >
                <span
                  className="rounded-pill transition-all"
                  style={{
                    display: "inline-block",
                    height: "5px",
                    width: isCurr ? (isDesktop ? "28px" : isTablet ? "24px" : "22px") : (isDesktop ? "10px" : isTablet ? "9px" : "8px"),
                    backgroundColor: isCurr ? m.accent : "rgba(255, 255, 255, 0.2)",
                    boxShadow: isCurr ? `0 0 10px ${m.accent}` : "none",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Right Cyber Arrow */}
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-cyber-glass rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ width: isDesktop ? "38px" : isTablet ? "36px" : "34px", height: isDesktop ? "38px" : isTablet ? "36px" : "34px", fontSize: isDesktop ? "0.95rem" : isTablet ? "0.9rem" : "0.88rem" }}
          aria-label="Next Metric"
          title="Next Metric"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
