"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CardModalHolo3DProps {
  accentHex: number;
}

export default function CardModalHolo3D({ accentHex }: CardModalHolo3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.z = 5.8;

    const handleResize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 360;
      const h = parent?.clientHeight || 320;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      if (camera.aspect < 1.1) {
        camera.position.z = 5.8 / Math.max(camera.aspect, 0.65);
      } else {
        camera.position.z = 5.8;
      }
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Outer Holographic Ring
    const outerRingGeom = new THREE.TorusGeometry(1.95, 0.02, 16, 80);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerRingGeom, outerRingMat);
    rootGroup.add(outerRing);

    // 2. Tilted Middle Ring
    const midRingGeom = new THREE.TorusGeometry(1.55, 0.015, 16, 64);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const midRing = new THREE.Mesh(midRingGeom, midRingMat);
    midRing.rotation.x = Math.PI / 4;
    midRing.rotation.y = Math.PI / 6;
    rootGroup.add(midRing);

    // 3. Central Wireframe Polyhedron
    const coreGeom = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    rootGroup.add(coreMesh);

    // 4. Orbiting Particles Field
    const particleCount = 48;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const r = 1.3 + Math.sin(i * 3) * 0.9;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: accentHex,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particles);

    // Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };
    window.addEventListener("pointermove", onPointerMove);

    let animId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const t = (time - startTime) * 0.001;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      rootGroup.rotation.x = mouse.y * 0.35;
      rootGroup.rotation.y = mouse.x * 0.45;

      outerRing.rotation.z = t * 0.15;
      midRing.rotation.y = -t * 0.25;
      midRing.rotation.z = t * 0.12;

      coreMesh.rotation.x = t * 0.2;
      coreMesh.rotation.y = t * 0.28;

      particles.rotation.z = -t * 0.1;

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);

      outerRingGeom.dispose();
      outerRingMat.dispose();
      midRingGeom.dispose();
      midRingMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [accentHex]);

  return (
    <div className="card-modal-holo3d-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="card-modal-holo3d-canvas" />
    </div>
  );
}
