"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { PERSONAL_INFO } from "../../data/portfolioData";

export interface CommNodeItem {
  id: string;
  category: string;
  label: string;
  subtitle: string;
  value: string;
  icon: string;
  accent: string;
  actionLabel?: string;
  actionHref?: string;
}

const COMM_NODES: CommNodeItem[] = [
  {
    id: "email",
    category: "Direct Contact",
    label: "Email",
    subtitle: "Inquiries & high-impact roles",
    value: PERSONAL_INFO.email,
    icon: "bi-envelope-at",
    accent: "#00f2fe",
    actionLabel: "Send Email",
    actionHref: `mailto:${PERSONAL_INFO.email}`,
  },
  {
    id: "location",
    category: "Base Location",
    label: "Location",
    subtitle: "Trivandrum, Kerala, India • IST (UTC+5:30)",
    value: "Remote & Relocation Ready",
    icon: "bi-geo-alt-fill",
    accent: "#ff2a85",
    actionLabel: "Available Worldwide",
  },
  {
    id: "linkedin",
    category: "Professional Network",
    label: "LinkedIn",
    subtitle: "Engineering network & career",
    value: "in/kiranchand-s",
    icon: "bi-linkedin",
    accent: "#38bdf8",
    actionLabel: "Connect on LinkedIn",
    actionHref: PERSONAL_INFO.linkedin,
  },
  {
    id: "github",
    category: "Source Code",
    label: "GitHub",
    subtitle: "Projects, systems & ML models",
    value: "github.com/kiran-atcore",
    icon: "bi-github",
    accent: "#38f9d7",
    actionLabel: "View Repositories",
    actionHref: PERSONAL_INFO.github,
  },
];

interface Connect3DCarouselProps {
  isExiting?: boolean;
}

export default function Connect3DCarousel({ isExiting = false }: Connect3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [laserPulse, setLaserPulse] = useState(false);
  const [screenTier, setScreenTier] = useState<"<sm" | "sm-md" | "md-lg" | ">lg">(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < 576) return "<sm";
      if (w < 768) return "sm-md";
      if (w < 992) return "md-lg";
      return ">lg";
    }
    return ">lg";
  });
  const [hasMounted, setHasMounted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Mouse Parallax tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Gesture tracking refs
  const dragStartPos = useRef<number | null>(null);
  const isDragging = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const laserPulseTrigger = useRef(1.0);

  // Responsive breakpoint tracking
  useEffect(() => {
    setHasMounted(true);
    const checkViewport = () => {
      const w = window.innerWidth;
      if (w < 576) {
        setScreenTier("<sm");
      } else if (w < 768) {
        setScreenTier("sm-md");
      } else if (w < 992) {
        setScreenTier("md-lg");
      } else {
        setScreenTier(">lg");
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const total = COMM_NODES.length;

  const triggerLaserRecalibration = useCallback((newIdx: number) => {
    laserPulseTrigger.current = 1.0;
    setLaserPulse(true);
    setActiveIndex(newIdx);
    setTimeout(() => setLaserPulse(false), 380);
  }, []);

  const handlePrev = useCallback(() => {
    triggerLaserRecalibration((activeIndex - 1 + total) % total);
  }, [activeIndex, total, triggerLaserRecalibration]);

  const handleNext = useCallback(() => {
    triggerLaserRecalibration((activeIndex + 1) % total);
  }, [activeIndex, total, triggerLaserRecalibration]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Pointer & Touch handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartPos.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartPos.current === null) return;
    const delta = dragStartPos.current - e.clientX;
    if (Math.abs(delta) > 30) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
    isDragging.current = false;
    dragStartPos.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
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

    if (Math.abs(deltaX) > 28 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // --------------------------------------------------------------------------
  // Three.js Scene: Rotating Hexagonal Quantum Pylon & Dynamic Laser Beams
  // --------------------------------------------------------------------------
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, screenTier === "<sm" ? 8.2 : screenTier === "sm-md" ? 7.8 : 7.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Master Pylon Group (Tilted slightly in isometric perspective)
    const pylonGroup = new THREE.Group();
    pylonGroup.position.set(0, -0.15, -0.6);
    rootGroup.add(pylonGroup);

    // 1. Central Hexagonal Quantum Pylon Column (Monolith)
    const pylonGeom = new THREE.CylinderGeometry(0.55, 0.72, 2.6, 6);
    const pylonMat = new THREE.MeshBasicMaterial({
      color: 0x030a16,
      transparent: true,
      opacity: 0.75,
    });
    const pylonMesh = new THREE.Mesh(pylonGeom, pylonMat);
    pylonGroup.add(pylonMesh);

    // Glowing wireframe outer cage
    const wireGeom = new THREE.EdgesGeometry(pylonGeom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    pylonGroup.add(wireMesh);

    // 2. Inner Glowing Energy Core
    const innerGeom = new THREE.CylinderGeometry(0.22, 0.22, 2.3, 6);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    pylonGroup.add(innerCore);

    // Apex Projector Emitter Crystal
    const apexGeom = new THREE.OctahedronGeometry(0.3, 1);
    const apexMat = new THREE.MeshBasicMaterial({
      color: 0x38f9d7,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const apexEmitter = new THREE.Mesh(apexGeom, apexMat);
    apexEmitter.position.y = 1.45;
    pylonGroup.add(apexEmitter);

    // 3. Concentric Hexagonal Holographic Base Rings
    const createHexRing = (radius: number, yPos: number, color: number, opacity: number) => {
      const ringGeom = new THREE.CylinderGeometry(radius, radius, 0.02, 6, 1, true);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = yPos;
      return { ring, ringMat };
    };

    const baseRing1 = createHexRing(1.8, -1.3, 0x00f2fe, 0.45);
    const baseRing2 = createHexRing(2.4, -1.35, 0xff2a85, 0.3);
    const midRing = createHexRing(1.1, 0.2, 0x38bdf8, 0.35);
    pylonGroup.add(baseRing1.ring);
    pylonGroup.add(baseRing2.ring);
    pylonGroup.add(midRing.ring);

    // 4. Ambient Vertical Particle Dust Stream (Rising upward along pylon)
    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.4 + Math.random() * 1.6;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = -1.5 + Math.random() * 3.2;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSpeeds.push(0.015 + Math.random() * 0.025);
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const verticalParticles = new THREE.Points(particleGeom, particleMat);
    pylonGroup.add(verticalParticles);

    // 5. Dynamic Laser Beam Lines Radiating Toward Active Card
    const laserBeamPositions = new Float32Array(2 * 3);
    laserBeamPositions[0] = 0;
    laserBeamPositions[1] = 1.45;
    laserBeamPositions[2] = 0;
    laserBeamPositions[3] = 0;
    laserBeamPositions[4] = 0;
    laserBeamPositions[5] = 1.2;

    const laserGeom = new THREE.BufferGeometry();
    laserGeom.setAttribute("position", new THREE.BufferAttribute(laserBeamPositions, 3));
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const laserLine = new THREE.Line(laserGeom, laserMat);
    pylonGroup.add(laserLine);

    // Secondary auxiliary pulse fan lines
    const auxLineCount = 3;
    const auxLines: THREE.Line[] = [];
    for (let i = 0; i < auxLineCount; i++) {
      const auxGeom = new THREE.BufferGeometry();
      const auxPos = new Float32Array(6);
      auxPos[0] = 0;
      auxPos[1] = 1.45;
      auxPos[2] = 0;
      auxPos[3] = (i - 1) * 0.8;
      auxPos[4] = -0.2;
      auxPos[5] = 0.8;
      auxGeom.setAttribute("position", new THREE.BufferAttribute(auxPos, 3));
      const auxMat = new THREE.LineBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(auxGeom, auxMat);
      auxLines.push(line);
      pylonGroup.add(line);
    }

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = window.innerWidth < 576 ? 8.2 : window.innerWidth < 768 ? 7.8 : 7.2;
      camera.updateProjectionMatrix();
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    let animationId: number;
    const startTime = performance.now();
    let previousTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - previousTime) / 1000, 0.1);
      const elapsed = (currentTime - startTime) / 1000;
      previousTime = currentTime;

      // Smooth Mouse Parallax Physics
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, delta * 3.5);
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, delta * 3.5);

      rootGroup.rotation.y = mouseRef.current.x * 0.22;
      rootGroup.rotation.x = -mouseRef.current.y * 0.15;

      // Pylon continuous slow rotation
      pylonMesh.rotation.y += delta * 0.35;
      wireMesh.rotation.y += delta * 0.35;
      innerCore.rotation.y -= delta * 0.5;

      // Apex emitter pulse & rotation
      apexEmitter.rotation.x += delta * 1.2;
      apexEmitter.rotation.y += delta * 0.8;
      const pulseScale = 1.0 + Math.sin(elapsed * 4.0) * 0.22;
      apexEmitter.scale.set(pulseScale, pulseScale, pulseScale);

      // Base rings counter-rotations
      baseRing1.ring.rotation.y += delta * 0.2;
      baseRing2.ring.rotation.y -= delta * 0.15;
      midRing.ring.rotation.y += delta * 0.3;

      // Rising vertical particle stream
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += particleSpeeds[i];
        if (arr[i * 3 + 1] > 1.8) {
          arr[i * 3 + 1] = -1.5;
        }
      }
      posAttr.needsUpdate = true;

      // Dynamic Laser Beam targeting active card in fan deck
      const activeIdx = activeIndexRef.current;
      const fanOffset = (activeIdx - 1.5) * 0.95; // Laser directs towards active card node position
      const laserArr = (laserGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      laserArr[3] = THREE.MathUtils.lerp(laserArr[3], fanOffset, delta * 8.0);
      laserArr[4] = THREE.MathUtils.lerp(laserArr[4], -0.1, delta * 8.0);
      laserArr[5] = THREE.MathUtils.lerp(laserArr[5], 1.5, delta * 8.0);
      laserGeom.attributes.position.needsUpdate = true;

      // Laser surge pulse decay on switch
      if (laserPulseTrigger.current > 0.05) {
        laserPulseTrigger.current = THREE.MathUtils.lerp(laserPulseTrigger.current, 0, delta * 4.5);
        laserMat.opacity = 0.4 + laserPulseTrigger.current * 0.6;
      } else {
        laserMat.opacity = 0.45 + Math.sin(elapsed * 6.0) * 0.2;
      }

      // Color Recalibration to active card accent color
      const activeAccent = COMM_NODES[activeIdx]?.accent || "#00f2fe";
      const targetCol = new THREE.Color(activeAccent);
      wireMat.color.lerp(targetCol, delta * 4.0);
      innerMat.color.lerp(targetCol, delta * 4.0);
      apexMat.color.lerp(targetCol, delta * 4.0);
      particleMat.color.lerp(targetCol, delta * 3.0);
      laserMat.color.lerp(targetCol, delta * 5.0);
      baseRing1.ringMat.color.lerp(targetCol, delta * 3.0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateSize);
      pylonGeom.dispose();
      pylonMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      apexGeom.dispose();
      apexMat.dispose();
      baseRing1.ring.geometry.dispose();
      baseRing1.ringMat.dispose();
      baseRing2.ring.geometry.dispose();
      baseRing2.ringMat.dispose();
      midRing.ring.geometry.dispose();
      midRing.ringMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      laserGeom.dispose();
      laserMat.dispose();
      auxLines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [screenTier]);

  // --------------------------------------------------------------------------
  // Isometric Fan Deck Layout & Stagger Math (Strictly 3 Visible Cards)
  // --------------------------------------------------------------------------
  const getFanDeckStyle = (idx: number) => {
    let diff = (idx - activeIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    const isSm = screenTier === "<sm";
    const isSmMd = screenTier === "sm-md";
    const isMdLg = screenTier === "md-lg";

    // Calibrated Horizontal Spread for wider background cards
    const spreadX = isSm ? 62 : isSmMd ? 120 : isMdLg ? 175 : 220;
    const spreadY = isSm ? 4 : isSmMd ? 6 : 8;
    const depthZ = isSm ? -60 : isSmMd ? -80 : -100;
    const rotZ = diff * (isSm ? 2.5 : 3.5); // Subtle fan tilt
    const rotY = diff * (isSm ? -6.0 : -8.5);

    if (diff === 0) {
      // 1. Active Front Card in Primary Focus
      return {
        transform: "translate3d(-50%, -50%, 40px) rotateX(6deg) rotateY(0deg) rotateZ(0deg) scale(1)",
        opacity: 1,
        zIndex: 12,
        pointerEvents: "auto" as const,
        filter: "blur(0px)",
      };
    } else if (Math.abs(diff) === 1) {
      // 2. The Two Visible Faded Cards on Left (diff = -1) and Right (diff = 1)
      const xOffset = diff * spreadX;
      const yOffset = spreadY;
      const zOffset = depthZ;
      const scale = isSm ? 0.86 : 0.88;
      const opacity = isSm ? 0.40 : 0.50;

      return {
        transform: `translate3d(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px), ${zOffset}px) rotateX(8deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
        opacity,
        zIndex: 8,
        pointerEvents: "auto" as const,
        filter: isSm ? "blur(1px)" : "blur(0.8px)",
      };
    } else {
      // 3. 4th card (hidden behind to maintain strictly 3 visible cards)
      const xOffset = diff * spreadX;
      const zOffset = depthZ * 1.5;

      return {
        transform: `translate3d(calc(-50% + ${xOffset}px), -50%, ${zOffset}px) scale(0.75)`,
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none" as const,
        filter: "blur(4px)",
      };
    }
  };

  const activeNode = COMM_NODES[activeIndex];

  return (
    <div
      className="quantum-pylon-wrapper position-relative w-100 d-flex flex-column align-items-center user-select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        height: screenTier === "<sm" ? "205px" : screenTier === "sm-md" ? "220px" : screenTier === "md-lg" ? "235px" : "250px",
        perspective: "1200px",
        touchAction: "pan-y",
      }}
    >
      {/* 1. Three.js Hexagonal Quantum Pylon WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* 2. Isometric Fan Deck Stage */}
      <div
        className="w-100 position-relative flex-grow-1"
        style={{ transformStyle: "preserve-3d", zIndex: 3 }}
      >
        {COMM_NODES.map((node, idx) => {
          const style = getFanDeckStyle(idx);
          const isActive = idx === activeIndex;

          return (
            <div
              key={node.id}
              onClick={() => triggerLaserRecalibration(idx)}
              className="fan-deck-card-slot position-absolute top-50 start-50"
              style={{
                ...style,
                width: screenTier === "<sm" ? "320px" : screenTier === "sm-md" ? "365px" : screenTier === "md-lg" ? "400px" : "420px",
                transition: hasMounted
                  ? "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.5s ease"
                  : "none",
                cursor: isActive ? "default" : "pointer",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Isometric Holographic Slate */}
              <div
                className={`isometric-deck-card rounded-3 position-relative d-flex flex-column justify-content-between overflow-hidden ${isActive ? "isometric-deck-card-active" : ""
                  }`}
                style={{

                  padding: screenTier === "<sm" ? "1.5rem 1rem" : screenTier === "sm-md" ? "1.8rem 0.9rem" : "2rem 1rem",
                  background: isActive ? "rgba(4, 9, 22, 0.94)" : "rgba(3, 7, 18, 0.75)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: isActive ? `1px solid ${node.accent}` : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive
                    ? `0 18px 40px rgba(0, 0, 0, 0.85), 0 0 24px ${node.accent}35, inset 0 0 12px ${node.accent}12`
                    : "0 8px 20px rgba(0, 0, 0, 0.55)",
                  transition: "all 0.4s ease",
                }}
              >
                {/* Subtle Framing Corner Accents */}
                <div className="slate-bracket-tl" style={{ borderColor: `${node.accent}70` }} />
                <div className="slate-bracket-tr" style={{ borderColor: `${node.accent}70` }} />
                <div className="slate-bracket-bl" style={{ borderColor: `${node.accent}70` }} />
                <div className="slate-bracket-br" style={{ borderColor: `${node.accent}70` }} />

                {/* Laser Target Reticle (Glows when active) */}
                {isActive && (
                  <div
                    className={`laser-receiver-target ${laserPulse ? "laser-pulse-active" : ""}`}
                    style={{ borderColor: node.accent }}
                  >
                    <span className="receiver-core" style={{ background: node.accent }} />
                  </div>
                )}

                {/* 1. Header: Category Tag & Status Indicator */}
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: node.accent,
                      boxShadow: `0 0 8px ${node.accent}`,
                    }}
                  />
                  <span
                    className="font-space-grotesk text-uppercase fw-semibold"
                    style={{
                      fontSize: screenTier === "<sm" ? "0.52rem" : "0.58rem",
                      color: node.accent,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {node.category}
                  </span>
                </div>

                {/* 2. Main Identity Block: Icon, Value & Subtitle */}
                <div className="d-flex align-items-center gap-2 my-1">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: screenTier === "<sm" ? "30px" : "36px",
                      height: screenTier === "<sm" ? "30px" : "36px",
                      background: `${node.accent}15`,
                      border: `1px solid ${node.accent}40`,
                      color: node.accent,
                    }}
                  >
                    <i className={`bi ${node.icon}`} style={{ fontSize: screenTier === "<sm" ? "1.0rem" : "1.15rem" }}></i>
                  </div>
                  <div className="min-w-0 flex-grow-1 text-start">
                    <div
                      className="font-syne text-white fw-bold text-truncate"
                      style={{
                        fontSize: screenTier === "<sm" ? "0.82rem" : "0.92rem",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {node.value}
                    </div>
                    <div
                      className="font-space-grotesk text-light text-opacity-65 text-truncate"
                      style={{ fontSize: screenTier === "<sm" ? "0.58rem" : "0.64rem" }}
                    >
                      {node.subtitle}
                    </div>
                  </div>
                </div>

                {/* 3. Action Controls: Direct, clean buttons */}
                <div className="pt-2 border-top mt-1" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  {node.id === "email" ? (
                    <div className="d-flex gap-2 justify-content-between align-items-center">
                      <a
                        href={node.actionHref}
                        className="btn btn-neon-cyan px-3 px-sm-4 py-2 rounded-pill tracking-wider text-uppercase font-syncopate flex-grow-1"
                        style={{ fontSize: "0.5rem" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bi bi-send me-2"></i> Send Email
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="btn btn-cyber-glass px-3 px-sm-4 py-2 rounded-pill tracking-wider text-uppercase font-syncopate"
                        style={{ fontSize: "0.5rem" }}
                        title="Copy email to clipboard"
                      >
                        {copied ? <span className="text-success">&check; Copied</span> : "Copy"}
                      </button>
                    </div>
                  ) : node.id === "location" ? (
                    <div className="text-center py-0">
                      <span
                        className="badge rounded-pill font-syncopate px-3 py-2 text-uppercase w-100 tracking-wider"
                        style={{
                          background: "rgba(255, 42, 133, 0.12)",
                          border: "1px solid rgba(255, 42, 133, 0.35)",
                          color: "#ff2a85",
                          fontSize: "0.5rem",
                        }}
                      >
                        <i className="bi bi-globe2 me-2"></i> Available Worldwide
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <a
                        href={node.actionHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-cyber-glass px-4 py-2 rounded-pill tracking-wider text-uppercase font-syncopate w-100 d-flex align-items-center justify-content-center gap-1"
                        style={{
                          fontSize: "0.5rem",
                          borderColor: `${node.accent}40`,
                          color: node.accent,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {node.actionLabel} &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Pagination Dots with Live Ping Animations */}
      <div
        className="d-flex align-items-center justify-content-center gap-2 mt-auto pt-1"
        style={{ zIndex: 10 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          className="btn btn-sm btn-cyber-glass rounded-circle p-0 d-flex align-items-center justify-content-center"
          style={{ width: "24px", height: "24px", fontSize: "0.70rem" }}
          aria-label="Previous quantum node"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="d-flex gap-2 align-items-center px-1">
          {COMM_NODES.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => triggerLaserRecalibration(idx)}
                className="position-relative p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                aria-label={`Switch to ${item.label}`}
              >
                {/* Concentric Live Ping Ripple Rings on Active */}
                {isActive && (
                  <span
                    className="position-absolute rounded-circle ping-ripple"
                    style={{
                      borderColor: item.accent,
                      boxShadow: `0 0 8px ${item.accent}`,
                    }}
                  />
                )}
                {/* Center Core Dot */}
                <span
                  className="rounded-circle transition-all"
                  style={{
                    width: isActive ? "8px" : "5px",
                    height: isActive ? "8px" : "5px",
                    background: isActive ? item.accent : "rgba(255, 255, 255, 0.3)",
                    boxShadow: isActive ? `0 0 10px ${item.accent}` : "none",
                    transition: "all 0.3s ease",
                  }}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="btn btn-sm btn-cyber-glass rounded-circle p-0 d-flex align-items-center justify-content-center"
          style={{ width: "24px", height: "24px", fontSize: "0.70rem" }}
          aria-label="Next quantum node"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
