"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SlideTelemetry3DCanvasProps {
  currentSlide: number;
  totalSlides?: number;
}

export default function SlideTelemetry3DCanvas({
  currentSlide,
  totalSlides = 4,
}: SlideTelemetry3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slideRef = useRef(currentSlide);
  slideRef.current = currentSlide;

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
    renderer.setSize(24, 24);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.z = 4.4;

    const group = new THREE.Group();
    scene.add(group);

    // 1. Minimal Hairline Outer Ring
    const outerGeom = new THREE.TorusGeometry(1.28, 0.015, 16, 64);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerGeom, outerMat);
    group.add(outerRing);

    // 2. Minimal Hairline Inner Ring
    const innerGeom = new THREE.TorusGeometry(0.95, 0.012, 16, 48);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38f9d7,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const innerRing = new THREE.Mesh(innerGeom, innerMat);
    innerRing.rotation.x = Math.PI / 3.5;
    group.add(innerRing);

    // 3. Crisp Minimalist Wireframe Core
    const coreGeom = new THREE.OctahedronGeometry(0.55, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    let animId: number;
    const startTime = performance.now();

    const animate = (time: number = performance.now()) => {
      animId = requestAnimationFrame(animate);
      const elapsed = (time - startTime) * 0.001;

      // Smooth, subtle ambient rotations
      outerRing.rotation.z = elapsed * 0.45;
      outerRing.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
      innerRing.rotation.y = -elapsed * 0.6;
      innerRing.rotation.z = Math.cos(elapsed * 0.5) * 0.25;

      // Core responds smoothly to active slide sector
      const targetAngle = (slideRef.current / Math.max(totalSlides, 1)) * Math.PI * 2;
      core.rotation.y += (targetAngle - core.rotation.y) * 0.08 + 0.005;
      core.rotation.x = Math.sin(elapsed * 0.8) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      outerGeom.dispose();
      outerMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [totalSlides]);

  return (
    <div className="slide-telemetry-3d-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="slide-telemetry-3d-canvas" width={24} height={24} />
    </div>
  );
}
