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
  isExiting: _isExiting = false,
}: Telemetry3DCarouselProps) {
  void _isExiting;
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
  const total = metrics.length;
  const lastActiveIndexRef = useRef(activeIndex);
  const rotorTargetAngleRef = useRef(
    total > 0 ? (activeIndex * (Math.PI * 2)) / total : 0
  );

  useEffect(() => {
    if (total <= 0) return;
    const last = lastActiveIndexRef.current;
    let diff = (activeIndex - last) % total;
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;
    rotorTargetAngleRef.current += diff * ((Math.PI * 2) / total);
    lastActiveIndexRef.current = activeIndex;
  }, [activeIndex, total]);

  // Touch / Drag tracking refs
  const dragStartPos = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Responsive breakpoint tracking (<576 mobile, 576-991 tablet, >=992 desktop)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHasMounted(true));
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  const isDesktop = screenTier === "desktop";
  const isTablet = screenTier === "tablet";

  const lastSwipeTime = useRef(0);
  const hasSwipedRef = useRef(false);

  const handlePrev = useCallback(() => {
    const now = Date.now();
    if (now - lastSwipeTime.current < 380) return;
    lastSwipeTime.current = now;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    const now = Date.now();
    if (now - lastSwipeTime.current < 380) return;
    lastSwipeTime.current = now;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Horizontal Touch / Pointer Gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // Touch events handle mobile swipes
    isDragging.current = true;
    dragStartPos.current = e.clientX;
    hasSwipedRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!isDragging.current || dragStartPos.current === null) return;
    const delta = dragStartPos.current - e.clientX;
    if (Math.abs(delta) > 35) {
      hasSwipedRef.current = true;
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 350);
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
    hasSwipedRef.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = (touchStartY.current ?? touchEndY) - touchEndY;

    // Trigger swipe if horizontal displacement exceeds 28px and dominates vertical motion
    if (Math.abs(deltaX) > 28 && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasSwipedRef.current = true;
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 350);

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

    // PBR Lighting for realistic metallic and holographic reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.8);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const pointLightFront = new THREE.PointLight(0x00f2fe, 3.2, 14);
    pointLightFront.position.set(0, 1.6, 3.8);
    scene.add(pointLightFront);

    const pointLightUnder = new THREE.PointLight(0xff2a85, 2.6, 12);
    pointLightUnder.position.set(0, -1.8, 3.2);
    scene.add(pointLightUnder);

    const pointLightBack = new THREE.PointLight(0x38f9d7, 1.8, 10);
    pointLightBack.position.set(0, 0, -3.2);
    scene.add(pointLightBack);

    // Track all disposable Three.js resources for clean unmount
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // 1. Semi-translucent Solid Composite Hull (Realistic 3D body with curvature reflection)
    const hullGeom = track(new THREE.CylinderGeometry(3.18, 3.18, 1.76, 64, 1, true));
    const hullMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x060d1b,
        roughness: 0.28,
        metalness: 0.85,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
      })
    );
    const cylinderHull = new THREE.Mesh(hullGeom, hullMat);
    rootGroup.add(cylinderHull);

    // 2. Holographic HUD Wireframe Overlay (Subtle technical cage over the solid hull)
    const cylGeom = track(new THREE.CylinderGeometry(3.2, 3.2, 1.8, 24, 6, true));
    const cylMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      })
    );
    const cylinderCage = new THREE.Mesh(cylGeom, cylMat);
    rootGroup.add(cylinderCage);

    // 3. Machined Heavy Collar Flanges (Top & Bottom Industrial Rims)
    const flangeGeom = track(new THREE.CylinderGeometry(3.24, 3.24, 0.08, 64, 1, true));
    const flangeMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x16233b,
        metalness: 0.9,
        roughness: 0.22,
      })
    );
    const topFlange = new THREE.Mesh(flangeGeom, flangeMat);
    topFlange.position.y = 0.88;
    rootGroup.add(topFlange);

    const bottomFlange = new THREE.Mesh(flangeGeom, flangeMat);
    bottomFlange.position.y = -0.88;
    rootGroup.add(bottomFlange);

    // 4. Chamfered Torus Rims with Glowing Cyber Edges
    const rimTorusGeom = track(new THREE.TorusGeometry(3.24, 0.035, 16, 64));
    const rimMatCyan = track(
      new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    const topRim = new THREE.Mesh(rimTorusGeom, rimMatCyan);
    topRim.position.y = 0.92;
    topRim.rotation.x = Math.PI / 2;
    rootGroup.add(topRim);

    const rimMatMagenta = track(
      new THREE.MeshStandardMaterial({
        color: 0xff2a85,
        emissive: 0xff2a85,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    const bottomRim = new THREE.Mesh(rimTorusGeom, rimMatMagenta);
    bottomRim.position.y = -0.92;
    bottomRim.rotation.x = Math.PI / 2;
    rootGroup.add(bottomRim);

    // Inner Lip Bevels
    const innerBevelGeom = track(new THREE.TorusGeometry(3.14, 0.02, 12, 64));
    const innerBevelMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x223654,
        metalness: 0.92,
        roughness: 0.25,
      })
    );
    const topInnerBevel = new THREE.Mesh(innerBevelGeom, innerBevelMat);
    topInnerBevel.position.y = 0.86;
    topInnerBevel.rotation.x = Math.PI / 2;
    rootGroup.add(topInnerBevel);

    const bottomInnerBevel = new THREE.Mesh(innerBevelGeom, innerBevelMat);
    bottomInnerBevel.position.y = -0.86;
    bottomInnerBevel.rotation.x = Math.PI / 2;
    rootGroup.add(bottomInnerBevel);

    // 5. Arrayed Hex Fastener Studs / Precision Rivets on Rims
    const rivetGeom = track(new THREE.CylinderGeometry(0.022, 0.022, 0.04, 8));
    const rivetMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x6280a8,
        metalness: 0.95,
        roughness: 0.15,
      })
    );
    const rivetCount = 16;
    for (let i = 0; i < rivetCount; i++) {
      const angle = (i / rivetCount) * Math.PI * 2;
      const x = Math.cos(angle) * 3.23;
      const z = Math.sin(angle) * 3.23;

      const topRivet = new THREE.Mesh(rivetGeom, rivetMat);
      topRivet.position.set(x, 0.92, z);
      rootGroup.add(topRivet);

      const bottomRivet = new THREE.Mesh(rivetGeom, rivetMat);
      bottomRivet.position.set(x, -0.92, z);
      rootGroup.add(bottomRivet);
    }

    // 6. Segmented Curved Armor Panels (Modular high-tech shroud with seams)
    const panelCount = 8;
    const panelMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x0c172a,
        metalness: 0.88,
        roughness: 0.32,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
      })
    );
    const panelAngleLength = ((Math.PI * 2) / panelCount) * 0.72;
    for (let i = 0; i < panelCount; i++) {
      const startAngle = (i / panelCount) * Math.PI * 2 + 0.05;
      const panelGeom = track(
        new THREE.CylinderGeometry(3.205, 3.205, 1.36, 16, 1, true, startAngle, panelAngleLength)
      );
      const panel = new THREE.Mesh(panelGeom, panelMat);
      rootGroup.add(panel);
    }

    // 7. Vertical Structural Struts / Support Pillars
    const strutGeom = track(new THREE.BoxGeometry(0.05, 1.76, 0.05));
    const strutMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x162238,
        metalness: 0.9,
        roughness: 0.25,
      })
    );
    const bracketGeom = track(new THREE.BoxGeometry(0.08, 0.07, 0.08));
    const bracketMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x273b5c,
        metalness: 0.92,
        roughness: 0.2,
      })
    );
    const neonStripeGeom = track(new THREE.BoxGeometry(0.015, 1.1, 0.02));
    const neonCyanMat = track(
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, blending: THREE.AdditiveBlending })
    );
    const neonMagentaMat = track(
      new THREE.MeshBasicMaterial({ color: 0xff2a85, blending: THREE.AdditiveBlending })
    );

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 3.2;
      const z = Math.sin(angle) * 3.2;

      const strut = new THREE.Mesh(strutGeom, strutMat);
      strut.position.set(x, 0, z);
      strut.rotation.y = -angle;
      rootGroup.add(strut);

      const topBracket = new THREE.Mesh(bracketGeom, bracketMat);
      topBracket.position.set(x, 0.88, z);
      topBracket.rotation.y = -angle;
      rootGroup.add(topBracket);

      const bottomBracket = new THREE.Mesh(bracketGeom, bracketMat);
      bottomBracket.position.set(x, -0.88, z);
      bottomBracket.rotation.y = -angle;
      rootGroup.add(bottomBracket);

      if (i % 2 === 0) {
        const neonStripe = new THREE.Mesh(
          neonStripeGeom,
          i % 4 === 0 ? neonCyanMat : neonMagentaMat
        );
        neonStripe.position.set(x * 1.008, 0, z * 1.008);
        neonStripe.rotation.y = -angle;
        rootGroup.add(neonStripe);
      }
    }

    // 8. Central Telemetry Track & Notched Optical Encoder Teeth
    const midRailGeom = track(new THREE.TorusGeometry(3.21, 0.02, 16, 64));
    const midRailMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x223554,
        metalness: 0.85,
        roughness: 0.3,
      })
    );
    const midRail = new THREE.Mesh(midRailGeom, midRailMat);
    midRail.rotation.x = Math.PI / 2;
    rootGroup.add(midRail);

    const notchGeom = track(new THREE.BoxGeometry(0.035, 0.065, 0.04));
    const notchMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x48658a,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    const notchCount = 32;
    for (let i = 0; i < notchCount; i++) {
      const angle = (i / notchCount) * Math.PI * 2;
      const x = Math.cos(angle) * 3.215;
      const z = Math.sin(angle) * 3.215;
      const notch = new THREE.Mesh(notchGeom, notchMat);
      notch.position.set(x, 0, z);
      notch.rotation.y = -angle;
      rootGroup.add(notch);
    }

    // Optical Guide Laser Rings (Accent guide lines around the mid rail)
    const laserRingGeom = track(new THREE.TorusGeometry(3.212, 0.012, 12, 64));
    const laserMatCyan = track(
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
    );
    const topLaser = new THREE.Mesh(laserRingGeom, laserMatCyan);
    topLaser.position.y = 0.2;
    topLaser.rotation.x = Math.PI / 2;
    rootGroup.add(topLaser);

    const laserMatMagenta = track(
      new THREE.MeshBasicMaterial({
        color: 0xff2a85,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      })
    );
    const bottomLaser = new THREE.Mesh(laserRingGeom, laserMatMagenta);
    bottomLaser.position.y = -0.2;
    bottomLaser.rotation.x = Math.PI / 2;
    rootGroup.add(bottomLaser);

    // 9. Inner Concentric Turbine Stator Core & Radial Spokes (Internal 3D Mechanical Depth)
    const innerCoreGeom = track(new THREE.CylinderGeometry(2.05, 2.05, 1.76, 32, 1, true));
    const innerCoreMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x070e1c,
        metalness: 0.92,
        roughness: 0.35,
        side: THREE.DoubleSide,
      })
    );
    const innerCore = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    rootGroup.add(innerCore);

    const corePlasmaGeom = track(new THREE.TorusGeometry(2.06, 0.026, 16, 48));
    const corePlasmaMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
    );
    const corePlasmaRing = new THREE.Mesh(corePlasmaGeom, corePlasmaMat);
    corePlasmaRing.rotation.x = Math.PI / 2;
    rootGroup.add(corePlasmaRing);

    // Radial Structural Spokes connecting Inner Core (r=2.05) to Outer Drum (r=3.20)
    const spokeGeom = track(new THREE.BoxGeometry(1.15, 0.025, 0.04));
    const spokeMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x1b283d,
        metalness: 0.88,
        roughness: 0.3,
      })
    );
    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const cx = Math.cos(angle) * 2.625;
      const cz = Math.sin(angle) * 2.625;

      const topSpoke = new THREE.Mesh(spokeGeom, spokeMat);
      topSpoke.position.set(cx, 0.86, cz);
      topSpoke.rotation.y = -angle;
      rootGroup.add(topSpoke);

      const bottomSpoke = new THREE.Mesh(spokeGeom, spokeMat);
      bottomSpoke.position.set(cx, -0.86, cz);
      bottomSpoke.rotation.y = -angle;
      rootGroup.add(bottomSpoke);
    }

    // 10. Glowing Gyro Rings (Cyan Top, Magenta Bottom)
    const ringGeom = track(new THREE.TorusGeometry(3.22, 0.02, 16, 64));
    const gyroRingMatCyan = track(
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
    const topRing = new THREE.Mesh(ringGeom, gyroRingMatCyan);
    topRing.position.y = 0.9;
    topRing.rotation.x = Math.PI / 2;
    rootGroup.add(topRing);

    const gyroRingMatMagenta = track(
      new THREE.MeshBasicMaterial({
        color: 0xff2a85,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      })
    );
    const bottomRing = new THREE.Mesh(ringGeom, gyroRingMatMagenta);
    bottomRing.position.y = -0.9;
    bottomRing.rotation.x = Math.PI / 2;
    rootGroup.add(bottomRing);

    // 11. Ambient Cyber Hologram Particles
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.8 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }
    const particleGeom = track(new THREE.BufferGeometry());
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = track(
      new THREE.PointsMaterial({
        color: 0x38f9d7,
        size: 0.05,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      })
    );
    const particles = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particles);

    updateSize();
    window.addEventListener("resize", updateSize);

    let animId: number;
    let currentRotorAngle = rotorTargetAngleRef.current;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smoothly interpolate 3D rotor rotation to follow continuous target angle (no rewind)
      const targetAngle = rotorTargetAngleRef.current;
      currentRotorAngle += (targetAngle - currentRotorAngle) * 0.08;

      // Always upright rotor drum rotating horizontally around Y-axis
      rootGroup.rotation.y = -currentRotorAngle;
      rootGroup.rotation.x = 0.1;
      rootGroup.rotation.z = 0;
      camera.position.z = isDesktop ? 7 : isTablet ? 7.2 : 7.35;

      // Subtle dynamic micro-motion
      const time = performance.now() * 0.0015;
      laserMatCyan.opacity = 0.45 + Math.sin(time * 3) * 0.12;
      laserMatMagenta.opacity = 0.35 + Math.cos(time * 3) * 0.1;
      corePlasmaRing.scale.setScalar(1 + Math.sin(time * 2.5) * 0.012);

      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [screenTier, isDesktop, isTablet]);

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
      data-horizontal-carousel="true"
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
              onClick={() => {
                if (hasSwipedRef.current) return;
                setActiveIndex(idx);
              }}
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
