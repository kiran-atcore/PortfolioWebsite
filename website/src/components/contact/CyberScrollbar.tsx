"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";

export default function CyberScrollbar({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollContainerRef as any });
  const [isVisible, setIsVisible] = useState(false);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 28,
    restDelta: 0.001
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Unconditional hook declarations to comply with React Rules of Hooks
  const progressHeight = useTransform(smoothProgress, (p) => `${Math.min(Math.max(p, 0), 1) * 100}%`);
  const tipPosition = useTransform(smoothProgress, (p) => `calc(${Math.min(Math.max(p, 0), 1) * 100}% - 8px)`);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setIsVisible(scrollHeight > clientHeight + 5);
      }
    };
    checkScroll();

    const observer = new ResizeObserver(() => checkScroll());
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
      if (scrollContainerRef.current.firstElementChild) {
        observer.observe(scrollContainerRef.current.firstElementChild);
      }
    }

    return () => observer.disconnect();
  }, [scrollContainerRef]);

  // Three.js animated beacon at the progress tip
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const size = 18;
    renderer.setSize(size, size);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.z = 2.4;

    // Outer spinning faceted octahedron
    const octaGeom = new THREE.OctahedronGeometry(0.55, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const octaMesh = new THREE.Mesh(octaGeom, octaMat);
    scene.add(octaMesh);

    // Inner glowing core
    const coreGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38f9d7,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    let animationId: number;
    let prevTime = performance.now();
    let currentScroll = 0;

    const unsubscribe = smoothProgress.on("change", (v) => {
      currentScroll = v;
    });

    let lastScroll = currentScroll;
    let scrollVelocity = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = performance.now();
      const delta = (time - prevTime) / 1000;
      prevTime = time;

      const scrollDelta = Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;

      scrollVelocity = THREE.MathUtils.lerp(scrollVelocity, scrollDelta * 120, delta * 10);

      octaMesh.rotation.y += delta * 2.0 + scrollVelocity * 0.15;
      octaMesh.rotation.x += delta * 1.5;

      const pulse = 1.0 + Math.sin(time * 0.005) * 0.18;
      coreMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      unsubscribe();
      octaGeom.dispose();
      octaMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [smoothProgress]);

  if (!isVisible) return null;

  return (
    <div
      className="position-absolute d-flex flex-column align-items-center"
      style={{
        top: "26px",
        bottom: "26px",
        right: "0px",
        width: "18px",
        zIndex: 50,
        pointerEvents: "none"
      }}
      aria-hidden="true"
    >
      {/* Top track node accent */}
      <span
        className="rounded-circle mb-1"
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: "#00f2fe",
          boxShadow: "0 0 6px #00f2fe",
          opacity: 0.7
        }}
      />

      {/* Progress Strip Track */}
      <div
        className="position-relative flex-grow-1 w-100 d-flex justify-content-center"
      >
        {/* Background Rail */}
        <div
          className="h-100 rounded-pill position-absolute"
          style={{
            width: "3px",
            background: "rgba(0, 242, 254, 0.1)",
            border: "1px solid rgba(0, 242, 254, 0.2)",
            boxShadow: "inset 0 0 4px rgba(0, 242, 254, 0.1)"
          }}
        />

        {/* Dynamic Progress Strip Fill */}
        <motion.div
          className="rounded-pill position-absolute top-0"
          style={{
            width: "3px",
            height: progressHeight,
            background: "linear-gradient(180deg, #00f2fe 0%, #38f9d7 70%, #ff2a85 100%)",
            boxShadow: "0 0 8px rgba(0, 242, 254, 0.8), 0 0 16px rgba(56, 249, 215, 0.4)",
          }}
        />

        {/* 3D Three.js Energy Beacon travelling at the tip of the progress */}
        <motion.div
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            width: "18px",
            height: "18px",
            top: tipPosition,
            filter: "drop-shadow(0 0 8px #00f2fe)",
          }}
        >
          <canvas ref={canvasRef} style={{ width: "18px", height: "18px" }} />
        </motion.div>
      </div>

      {/* Bottom track node accent */}
      <span
        className="rounded-circle mt-1"
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: "#ff2a85",
          boxShadow: "0 0 6px #ff2a85",
          opacity: 0.7
        }}
      />
    </div>
  );
}

