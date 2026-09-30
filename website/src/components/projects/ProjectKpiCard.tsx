"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ProjectKpiCardProps {
  metric: string;
  index: number;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
    glow: string;
  };
}

function parseMetric(metric: string): { value: string; label: string } {
  const match = metric.match(
    /^([~<]?\d+[%+]?|Sub-second|Live(?:\sWebSocket)?)\s*(.*)$/i
  );
  if (match) {
    return {
      value: match[1],
      label: match[2] || "Performance Metric",
    };
  }
  const parts = metric.split(" ");
  if (parts.length > 1) {
    return {
      value: parts[0],
      label: parts.slice(1).join(" "),
    };
  }
  return { value: metric, label: "Verified Metric" };
}

function Kpi3DHologram({
  index,
  primaryColorHex,
  secondaryColorHex,
  isHovered,
}: {
  index: number;
  primaryColorHex: string;
  secondaryColorHex: string;
  isHovered: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef(isHovered);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

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
    renderer.setSize(48, 48);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    camera.position.z = 4.2;

    const group = new THREE.Group();
    scene.add(group);

    const pColor = new THREE.Color(primaryColorHex);
    const sColor = new THREE.Color(secondaryColorHex);

    const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

    // Distinct 3D Hologram based on index % 3
    const mode = index % 3;
    let mesh1: THREE.Mesh;
    let mesh2: THREE.Mesh;

    if (mode === 0) {
      // 1. Quantum Octahedron Node with Torus Ring
      const geom1 = new THREE.OctahedronGeometry(0.95, 0);
      const mat1 = new THREE.MeshBasicMaterial({
        color: pColor,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      mesh1 = new THREE.Mesh(geom1, mat1);

      const geom2 = new THREE.TorusGeometry(1.28, 0.015, 16, 48);
      const mat2 = new THREE.MeshBasicMaterial({
        color: sColor,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      mesh2 = new THREE.Mesh(geom2, mat2);

      group.add(mesh1);
      group.add(mesh2);
      disposables.push(geom1, mat1, geom2, mat2);
    } else if (mode === 1) {
      // 2. Dual Concentric Gyro-Rings with Central Point Core
      const geom1 = new THREE.TorusGeometry(1.15, 0.02, 16, 48);
      const mat1 = new THREE.MeshBasicMaterial({
        color: pColor,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      mesh1 = new THREE.Mesh(geom1, mat1);

      const geom2 = new THREE.TorusGeometry(0.85, 0.018, 16, 36);
      const mat2 = new THREE.MeshBasicMaterial({
        color: sColor,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      mesh2 = new THREE.Mesh(geom2, mat2);
      mesh2.rotation.x = Math.PI / 2.5;

      const coreGeom = new THREE.DodecahedronGeometry(0.35, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Mesh(coreGeom, coreMat);
      group.add(core);

      group.add(mesh1);
      group.add(mesh2);
      disposables.push(geom1, mat1, geom2, mat2, coreGeom, coreMat);
    } else {
      // 3. Geodesic Icosahedron Cyber-Prism
      const geom1 = new THREE.IcosahedronGeometry(0.9, 0);
      const mat1 = new THREE.MeshBasicMaterial({
        color: pColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      mesh1 = new THREE.Mesh(geom1, mat1);

      const geom2 = new THREE.OctahedronGeometry(0.45, 0);
      const mat2 = new THREE.MeshBasicMaterial({
        color: sColor,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      mesh2 = new THREE.Mesh(geom2, mat2);

      group.add(mesh1);
      group.add(mesh2);
      disposables.push(geom1, mat1, geom2, mat2);
    }

    let animId: number;
    const startTime = performance.now();
    let currentSpeed = 1.0;

    const animate = (time: number = performance.now()) => {
      animId = requestAnimationFrame(animate);
      const targetSpeed = hoverRef.current ? 2.6 : 1.0;
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      const elapsed = (time - startTime) * 0.001 * currentSpeed;

      group.rotation.y = elapsed * 0.75;
      group.rotation.x = Math.sin(elapsed * 0.5) * 0.25;

      if (mesh2) {
        mesh2.rotation.x = elapsed * 1.1;
        mesh2.rotation.z = Math.cos(elapsed * 0.6) * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [index, primaryColorHex, secondaryColorHex]);

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-shrink-0 position-relative"
      style={{
        width: 48,
        height: 48,
        borderRadius: "10px",
        background: "rgba(0, 242, 254, 0.03)",
        border: "1px solid rgba(0, 242, 254, 0.15)",
        boxShadow: "inset 0 0 10px rgba(0, 242, 254, 0.05)",
      }}
    >
      <canvas ref={canvasRef} width={48} height={48} style={{ display: "block" }} />
    </div>
  );
}

export default function ProjectKpiCard({
  metric,
  index,
  theme,
}: ProjectKpiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { value, label } = parseMetric(metric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="position-relative overflow-hidden h-100 d-flex flex-column rounded-3 text-white p-3 p-sm-3.5"
      style={{
        background: isHovered
          ? "linear-gradient(145deg, rgba(8, 22, 42, 0.92) 0%, rgba(14, 16, 36, 0.95) 100%)"
          : "linear-gradient(145deg, rgba(6, 15, 30, 0.85) 0%, rgba(10, 12, 26, 0.88) 100%)",
        border: isHovered
          ? `1px solid ${theme.primary}88`
          : "1px solid rgba(0, 242, 254, 0.22)",
        boxShadow: isHovered
          ? `0 16px 36px rgba(0, 0, 0, 0.75), 0 0 24px ${theme.glow}, inset 0 0 16px rgba(0, 242, 254, 0.08)`
          : "0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 242, 254, 0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition:
          "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Mini Cyber Corner Brackets */}
      <div
        className="position-absolute top-0 start-0"
        style={{
          width: 8,
          height: 8,
          borderTop: "2px solid #00f2fe",
          borderLeft: "2px solid #00f2fe",
          borderTopLeftRadius: "6px",
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
        }}
      />

      {/* Laser Scan Shimmer */}
      <motion.div
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: index * 0.7 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #00f2fe, transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Row: Telemetry Badge + 3D Hologram */}
      <div className="d-flex align-items-center justify-content-between mb-2 pb-1">
        <div className="d-inline-flex align-items-center gap-1.5">
          <span
            className="pulse-cyan me-3"
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              backgroundColor: theme.primary,
              boxShadow: `0 0 6px ${theme.primary}`,
            }}
          />
          <span
            className="font-space-grotesk text-uppercase text-light text-opacity-60"
            style={{ fontSize: "0.6rem", letterSpacing: "0.18em" }}
          >
            {`KPI // 0${index + 1}`}
          </span>
        </div>

        {/* 3D Three.js Interactive Hologram Node */}
        <Kpi3DHologram
          index={index}
          primaryColorHex={theme.primary}
          secondaryColorHex={theme.secondary}
          isHovered={isHovered}
        />
      </div>

      {/* Primary Quantitative Value Display */}
      <div className="my-auto py-1">
        <div
          className="font-syncopate fw-semibold text-white mb-1"
          style={{
            fontSize: "clamp(1.35rem, 3.2vw, 1.75rem)",
            letterSpacing: "0.04em",
            textShadow: `0 0 18px ${theme.glow}`,
            color: "#ffffff",
          }}
        >
          {value}
        </div>
        <p
          className="font-outfit text-light text-opacity-75 mb-0"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            lineHeight: 1.45,
          }}
        >
          {label}
        </p>
      </div>

      {/* Bottom Telemetry Status Gauge */}
      <div className="pt-2 mt-2 border-top border-white border-opacity-10 d-flex align-items-center justify-content-between">
        <span
          className="font-space-grotesk text-uppercase"
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: theme.primary,
          }}
        >
          VERIFIED TELEMETRY
        </span>
        <div
          className="d-flex align-items-center gap-1"
          style={{ opacity: 0.6 }}
        >
          <div
            style={{
              width: 14,
              height: 3,
              borderRadius: 2,
              background: theme.primary,
            }}
          />
          <div
            style={{
              width: 6,
              height: 3,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
