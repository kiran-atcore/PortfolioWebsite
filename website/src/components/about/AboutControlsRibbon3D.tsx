"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface AboutControlsRibbon3DProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
}

export default function AboutControlsRibbon3D({
  currentSlide,
  totalSlides,
  isPlaying,
}: AboutControlsRibbon3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State refs for animation loop
  const slideRef = useRef(currentSlide);
  slideRef.current = currentSlide;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
  });

  const shockwavesRef = useRef<{ x: number; radius: number; maxRadius: number; opacity: number; color: THREE.Color }[]>([]);

  // Trigger shockwave whenever slide changes
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 280;
    // Calculate approximate X position for the active slide indicator
    // Dots are centered-ish in the control dock
    const stepRatio = (currentSlide + 0.5) / Math.max(1, totalSlides);
    const startX = (stepRatio - 0.5) * (width * 0.4);

    shockwavesRef.current.push({
      x: startX,
      radius: 2,
      maxRadius: width * 0.6,
      opacity: 0.9,
      color: new THREE.Color(isPlayingRef.current ? 0x00f2fe : 0xff2a85),
    });
  }, [currentSlide, totalSlides]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 280;
    let height = container.clientHeight || 42;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    camera.position.z = 10;

    // 1. Sleek Laser Baseline Ribbons (Anchored at bottom perimeter)
    const ribbonPointCount = 60;
    const waveGeom1 = new THREE.BufferGeometry();
    const waveGeom2 = new THREE.BufferGeometry();
    const wavePos1 = new Float32Array(ribbonPointCount * 3);
    const wavePos2 = new Float32Array(ribbonPointCount * 3);

    waveGeom1.setAttribute("position", new THREE.BufferAttribute(wavePos1, 3));
    waveGeom2.setAttribute("position", new THREE.BufferAttribute(wavePos2, 3));

    const cyanMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });

    const mintMat = new THREE.LineBasicMaterial({
      color: 0x38f9d7,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    const ribbon1 = new THREE.Line(waveGeom1, cyanMat);
    const ribbon2 = new THREE.Line(waveGeom2, mintMat);
    scene.add(ribbon1);
    scene.add(ribbon2);

    // 2. Micro Ambient Quantum Stardust (Soft, peripheral, non-obtrusive)
    const particleCount = 20;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; baseSpeed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * width;
      // Vertically centered around string (y = 0)
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      particleVelocities.push({
        x: (Math.random() * 0.4 + 0.15) * (Math.random() > 0.5 ? 1 : -1),
        y: (Math.random() - 0.5) * 0.08,
        baseSpeed: Math.random() * 0.015 + 0.005,
      });
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Circle texture for ultra-soft particle glow
    const makeParticleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        grad.addColorStop(0.35, "rgba(0, 242, 254, 0.4)");
        grad.addColorStop(0.8, "rgba(56, 249, 215, 0.1)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(c);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 3.5,
      map: makeParticleTexture(),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 3. Dynamic Shockwave Mesh Ring (Re-used for ripple pulses)
    const shockwaveGeom = new THREE.RingGeometry(1, 1.8, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeom, shockwaveMat);
    shockwaveMesh.scale.set(1, 0.45, 1); // Oval perspective along pill
    scene.add(shockwaveMesh);

    // Mouse Tracking listeners on parent container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const localX = e.clientX - rect.left - rect.width / 2;
      const localY = -(e.clientY - rect.top - rect.height / 2);
      mouseRef.current.targetX = localX;
      mouseRef.current.targetY = localY;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          camera.left = -width / 2;
          camera.right = width / 2;
          camera.top = height / 2;
          camera.bottom = -height / 2;
          camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += isPlayingRef.current ? 0.035 : 0.015;

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      const halfW = width / 2;
      const halfH = height / 2;
      const speedMult = isPlayingRef.current ? 1.2 : 0.6;

      // Update Wave 1 (Primary quantum wave string centered vertically)
      const p1 = waveGeom1.attributes.position.array as Float32Array;
      for (let i = 0; i < ribbonPointCount; i++) {
        const x = -halfW + (i / (ribbonPointCount - 1)) * width;
        const distToMouse = Math.abs(x - mouseRef.current.x);
        const mouseLift = mouseRef.current.isHovered ? Math.max(0, 1 - distToMouse / 60) * (mouseRef.current.y * 0.35) : 0;
        const y = Math.sin(x * 0.05 + clock * speedMult) * 2.4 + mouseLift;
        p1[i * 3] = x;
        p1[i * 3 + 1] = y;
        p1[i * 3 + 2] = 0;
      }
      waveGeom1.attributes.position.needsUpdate = true;

      // Update Wave 2 (Harmonic wave string centered vertically)
      const p2 = waveGeom2.attributes.position.array as Float32Array;
      for (let i = 0; i < ribbonPointCount; i++) {
        const x = -halfW + (i / (ribbonPointCount - 1)) * width;
        const y = Math.cos(x * 0.04 - clock * 0.7 * speedMult) * 1.8;
        p2[i * 3] = x;
        p2[i * 3 + 1] = y;
        p2[i * 3 + 2] = 0;
      }
      waveGeom2.attributes.position.needsUpdate = true;

      // Update Particles
      const partPos = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        partPos[idx] += particleVelocities[i].x * speedMult;

        // Particle magnetic pull toward mouse
        if (mouseRef.current.isHovered) {
          const dx = mouseRef.current.x - partPos[idx];
          const dy = mouseRef.current.y - partPos[idx + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60 && dist > 1) {
            partPos[idx] += (dx / dist) * 0.8;
            partPos[idx + 1] += (dy / dist) * 0.8;
          }
        }

        // Particle edge wrapping
        if (partPos[idx] > halfW) partPos[idx] = -halfW;
        if (partPos[idx] < -halfW) partPos[idx] = halfW;

        partPos[idx + 1] += Math.sin(clock * 2 + i) * 0.12;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Update Active Shockwaves
      if (shockwavesRef.current.length > 0) {
        const activeWave = shockwavesRef.current[shockwavesRef.current.length - 1];
        activeWave.radius += 3.5;
        activeWave.opacity *= 0.93;

        shockwaveMesh.position.x = activeWave.x;
        shockwaveMesh.position.y = 0;
        shockwaveMesh.scale.set(activeWave.radius, activeWave.radius * 0.35, 1);
        shockwaveMat.opacity = activeWave.opacity;
        shockwaveMat.color.copy(activeWave.color);

        if (activeWave.opacity < 0.02 || activeWave.radius > activeWave.maxRadius) {
          shockwavesRef.current.pop();
          shockwaveMat.opacity = 0;
        }
      }

      // Color shift when paused
      if (!isPlayingRef.current) {
        cyanMat.color.lerp(new THREE.Color(0xff2a85), 0.04);
        mintMat.color.lerp(new THREE.Color(0x7928ca), 0.04);
      } else {
        cyanMat.color.lerp(new THREE.Color(0x00f2fe), 0.04);
        mintMat.color.lerp(new THREE.Color(0x38f9d7), 0.04);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      renderer.dispose();
      waveGeom1.dispose();
      waveGeom2.dispose();
      cyanMat.dispose();
      mintMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      shockwaveGeom.dispose();
      shockwaveMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
      style={{
        pointerEvents: "none",
        borderRadius: "inherit",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-100 h-100 d-block"
        style={{
          opacity: 0.6,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
