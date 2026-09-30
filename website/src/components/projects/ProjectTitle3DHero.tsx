"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ProjectTitle3DHeroProps {
  title: string;
  tagline: string;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
    glow: string;
  };
  id: string;
}

export default function ProjectTitle3DHero({
  title,
  tagline,
  theme,
  id,
}: ProjectTitle3DHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 140;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const group = new THREE.Group();
    scene.add(group);

    const primaryColor = new THREE.Color(theme.primary);
    const secondaryColor = new THREE.Color(theme.secondary);

    // 1. Constellation Particle Grid
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const originalPositions: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      originalPositions.push({
        x,
        y,
        z,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });

      const mixedColor = primaryColor.clone().lerp(secondaryColor, Math.random());
      colorArray[i * 3] = mixedColor.r;
      colorArray[i * 3 + 1] = mixedColor.g;
      colorArray[i * 3 + 2] = mixedColor.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    group.add(particles);

    // 2. Geometric Holographic Rings (Floating Cyber Nodes)
    const ringCount = 3;
    const rings: THREE.Mesh[] = [];
    const ringGeoms: THREE.TorusGeometry[] = [];
    const ringMats: THREE.MeshBasicMaterial[] = [];

    for (let r = 0; r < ringCount; r++) {
      const rGeom = new THREE.TorusGeometry(1.4 + r * 1.1, 0.012, 16, 48);
      const rMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? primaryColor : secondaryColor,
        transparent: true,
        opacity: 0.25 - r * 0.06,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(rGeom, rMat);
      ringMesh.position.set((r - 1) * 8, (r % 2 === 0 ? 1 : -1) * 1.5, -2);
      group.add(ringMesh);
      rings.push(ringMesh);
      ringGeoms.push(rGeom);
      ringMats.push(rMat);
    }

    // 3. Pointer move interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x * 2.5;
      mousePos.current.targetY = y * 1.5;
    };

    const handleMouseLeave = () => {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 4. Resize listener
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 140;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 5. Animation loop
    let animId: number;
    const startTime = performance.now();

    const animate = (time: number = performance.now()) => {
      animId = requestAnimationFrame(animate);
      const elapsed = (time - startTime) * 0.001;

      // Smooth pointer parallax
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      camera.position.x = mousePos.current.x;
      camera.position.y = mousePos.current.y;
      camera.lookAt(0, 0, 0);

      // Animate particles
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const orig = originalPositions[i];
        positions[i * 3 + 1] =
          orig.y + Math.sin(elapsed * orig.speed + orig.phase) * 1.1;
        positions[i * 3] =
          orig.x + Math.cos(elapsed * 0.4 * orig.speed + orig.phase) * 0.6;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Animate floating rings
      rings.forEach((ring, idx) => {
        ring.rotation.x = elapsed * (0.3 + idx * 0.15);
        ring.rotation.y = elapsed * (0.4 - idx * 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      particleGeom.dispose();
      particleMat.dispose();
      ringGeoms.forEach((g) => g.dispose());
      ringMats.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [theme]);

  // Framer Motion staggered word reveal
  const titleWords = title.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="position-relative overflow-hidden rounded-3 p-3 p-sm-3.5 mb-3"
      style={{
        background: isHovered
          ? "linear-gradient(135deg, rgba(3, 8, 20, 0.85) 0%, rgba(8, 12, 28, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(2, 6, 16, 0.65) 0%, rgba(5, 8, 20, 0.75) 100%)",
        border: isHovered
          ? `1px solid ${theme.primary}66`
          : "1px solid rgba(0, 242, 254, 0.18)",
        boxShadow: isHovered
          ? `0 12px 30px rgba(0, 0, 0, 0.7), 0 0 25px ${theme.glow}, inset 0 0 15px rgba(0, 242, 254, 0.06)`
          : "0 6px 20px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0, 242, 254, 0.02)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Three.js Ethereal Constellation Canvas (Pointer-events none) */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100 pe-none"
        style={{ zIndex: 0, opacity: isHovered ? 0.95 : 0.65, transition: "opacity 0.4s ease" }}
      />

      {/* Cyber Micro Corner Bracket Accents */}
      <div
        className="position-absolute top-0 start-0"
        style={{
          width: 8,
          height: 8,
          borderTop: "2px solid #00f2fe",
          borderLeft: "2px solid #00f2fe",
          borderTopLeftRadius: "6px",
          zIndex: 1,
        }}
      />
      <div
        className="position-absolute top-0 end-0"
        style={{
          width: 8,
          height: 8,
          borderTop: "2px solid #00f2fe",
          borderRight: "2px solid #00f2fe",
          borderTopRightRadius: "6px",
          zIndex: 1,
        }}
      />
      <div
        className="position-absolute bottom-0 start-0"
        style={{
          width: 8,
          height: 8,
          borderBottom: `2px solid ${theme.primary}`,
          borderLeft: `2px solid ${theme.primary}`,
          borderBottomLeftRadius: "6px",
          zIndex: 1,
        }}
      />
      <div
        className="position-absolute bottom-0 end-0"
        style={{
          width: 8,
          height: 8,
          borderBottom: `2px solid ${theme.primary}`,
          borderRight: `2px solid ${theme.primary}`,
          borderBottomRightRadius: "6px",
          zIndex: 1,
        }}
      />

      {/* Laser Scanning Shimmer Line */}
      <motion.div
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "80px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #00f2fe, transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Foreground Content with High Z-Index */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        {/* Top Micro Telemetry Indicator */}
        <div className="d-flex align-items-center justify-content-between mb-1">
          <div className="d-inline-flex align-items-center gap-1.5">
            <span
              className="pulse-cyan me-2"
              aria-hidden="true"
              style={{
                width: 5,
                height: 5,
                backgroundColor: theme.primary,
                boxShadow: `0 0 6px ${theme.primary}`,
              }}
            />
            <span
              className="font-space-grotesk text-uppercase text-light text-opacity-50"
              style={{ fontSize: "0.55rem", letterSpacing: "0.3em" }}
            >
              {`// SPEC_NODE :: ${id.toUpperCase()}`}
            </span>
          </div>

          <span
            className="font-space-grotesk text-uppercase d-none d-sm-inline-block text-light text-opacity-40"
            style={{ fontSize: "0.45rem", letterSpacing: "0.2em" }}
          >
            SYS_ARCH // VERIFIED
          </span>
        </div>

        {/* Framer Motion Staggered Title */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-syne fw-bold text-white text-uppercase spec-title d-flex flex-wrap gap-2 my-2"
          style={{
            textShadow: isHovered
              ? `0 0 35px ${theme.glow}, 0 0 60px ${theme.primary}55`
              : `0 0 25px ${theme.glow}`,
            transition: "text-shadow 0.35s ease",
          }}
        >
          {titleWords.map((word, wIdx) => (
            <motion.span
              key={wIdx}
              variants={wordVariants}
              className="d-inline-block"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline with Ambient Glow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-outfit fw-medium spec-tagline mb-0"
          style={{
            color: theme.primary,
            textShadow: `0 0 12px ${theme.primary}66`,
          }}
        >
          <span className="me-1" style={{ color: theme.secondary }}>//</span> {tagline}
        </motion.p>
      </div>
    </div>
  );
}
