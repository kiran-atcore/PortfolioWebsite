"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DomainCyberCanvas3DProps {
  activeDomainIndex: number;
  isExploreHovered: boolean;
}

const DOMAIN_COLORS = [
  new THREE.Color(0x00f2fe), // Full Stack (Cyan)
  new THREE.Color(0xc084fc), // AI & ML (Purple)
  new THREE.Color(0x34d399), // Mobile (Emerald)
];

export default function DomainCyberCanvas3D({
  activeDomainIndex,
  isExploreHovered,
}: DomainCyberCanvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ activeDomainIndex, isExploreHovered });
  
  useEffect(() => {
    stateRef.current = { activeDomainIndex, isExploreHovered };
  }, [activeDomainIndex, isExploreHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.5, 6.5);

    const updateSize = () => {
      const w = parent.clientWidth || 350;
      const h = parent.clientHeight || 280;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    updateSize();

    // 1. Reactive Particle Horizon Grid
    const cols = 28;
    const rows = 14;
    const count = cols * rows;
    const gridPos = new Float32Array(count * 3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 3;
        gridPos[i] = (c - cols / 2) * 0.45;
        gridPos[i + 1] = -1.2 + (r / rows) * 0.9;
        gridPos[i + 2] = (r - rows) * 0.4;
      }
    }
    const gridGeom = new THREE.BufferGeometry();
    gridGeom.setAttribute("position", new THREE.BufferAttribute(gridPos, 3));
    const gridMat = new THREE.PointsMaterial({
      size: 0.055,
      color: DOMAIN_COLORS[0],
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const gridPoints = new THREE.Points(gridGeom, gridMat);
    scene.add(gridPoints);

    // 2. Warp Telemetry Filaments
    const filamentCount = 45;
    const filamentPos = new Float32Array(filamentCount * 3);
    const filamentSpeeds = new Float32Array(filamentCount);
    for (let i = 0; i < filamentCount; i++) {
      const idx = i * 3;
      filamentPos[idx] = (Math.random() - 0.5) * 4.5;
      filamentPos[idx + 1] = (Math.random() - 0.5) * 3.5;
      filamentPos[idx + 2] = (Math.random() - 0.5) * 2;
      filamentSpeeds[i] = 0.015 + Math.random() * 0.03;
    }
    const filamentGeom = new THREE.BufferGeometry();
    filamentGeom.setAttribute("position", new THREE.BufferAttribute(filamentPos, 3));
    const filamentMat = new THREE.PointsMaterial({
      size: 0.075,
      color: DOMAIN_COLORS[0],
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const filamentPoints = new THREE.Points(filamentGeom, filamentMat);
    scene.add(filamentPoints);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(parent);

    let animId: number;
    const timer = new THREE.Timer();
    const targetColor = new THREE.Color();

    const animate = (timestamp?: number) => {
      animId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const time = timer.getElapsed();
      const { activeDomainIndex: dIdx, isExploreHovered: hovered } = stateRef.current;

      targetColor.copy(DOMAIN_COLORS[dIdx] || DOMAIN_COLORS[0]);
      gridMat.color.lerp(targetColor, 0.06);
      filamentMat.color.lerp(targetColor, 0.06);

      // Undulate grid
      const posAttr = gridGeom.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 3;
          arr[i + 1] = -1.2 + Math.sin(time * 1.8 + arr[i] * 1.5) * 0.16 + (r / rows) * 0.4;
        }
      }
      posAttr.needsUpdate = true;

      // Animate filaments downward with warp acceleration on hover
      const speedMult = hovered ? 3.8 : 1.0;
      const fPos = (filamentGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < filamentCount; i++) {
        const yIdx = i * 3 + 1;
        fPos[yIdx] -= filamentSpeeds[i] * speedMult;
        if (fPos[yIdx] < -2.4) {
          fPos[yIdx] = 2.2;
          fPos[i * 3] = (Math.random() - 0.5) * (hovered ? 2.5 : 4.5);
        }
      }
      filamentGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      timer.dispose();
      resizeObserver.disconnect();
      gridGeom.dispose();
      gridMat.dispose();
      filamentGeom.dispose();
      filamentMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
}
