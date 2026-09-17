"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CardsHoloCore3D() {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 7.5;

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || 450;
      const h = rect?.height || 450;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Root group for the entire 3D cyber assembly
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // 1. OUTER CYBER HALO RINGS (R = 2.28 & R = 2.20)
    // ==========================================
    const mainRingGeom = new THREE.TorusGeometry(2.28, 0.024, 24, 128);
    const mainRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const mainRing = new THREE.Mesh(mainRingGeom, mainRingMat);
    rootGroup.add(mainRing);

    const accentRingGeom = new THREE.TorusGeometry(2.20, 0.012, 16, 128);
    const accentRingMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const accentRing = new THREE.Mesh(accentRingGeom, accentRingMat);
    rootGroup.add(accentRing);

    // ==========================================
    // 2. CYBER HUD SEGMENTED ARCS & TICKS (R = 2.50)
    // ==========================================
    const hudGroup = new THREE.Group();
    rootGroup.add(hudGroup);

    const arcRadius = 2.50;
    const arcGeomList: THREE.BufferGeometry[] = [];
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const bracketSpans = [
      { start: 0.25, end: 1.25 },
      { start: 1.82, end: 2.82 },
      { start: 3.39, end: 4.39 },
      { start: 4.96, end: 5.96 },
    ];

    bracketSpans.forEach((span) => {
      const segments = 16;
      const points: number[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = span.start + ((span.end - span.start) * i) / segments;
        points.push(Math.cos(theta) * arcRadius, Math.sin(theta) * arcRadius, 0);
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      arcGeomList.push(geom);
      const arcLine = new THREE.Line(geom, arcMat);
      hudGroup.add(arcLine);
    });

    const tickGeom = new THREE.BufferGeometry();
    const tickPoints: number[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const rInner = 2.44;
      const rOuter = i % 2 === 0 ? 2.62 : 2.54;
      tickPoints.push(
        Math.cos(angle) * rInner,
        Math.sin(angle) * rInner,
        0,
        Math.cos(angle) * rOuter,
        Math.sin(angle) * rOuter,
        0
      );
    }
    tickGeom.setAttribute("position", new THREE.Float32BufferAttribute(tickPoints, 3));
    const tickMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ticksMesh = new THREE.LineSegments(tickGeom, tickMat);
    hudGroup.add(ticksMesh);

    // ==========================================
    // 3. SPREAD-OUT CONCENTRIC RINGS (R = 0.65 & R = 1.45)
    // ==========================================
    const spreadGroup = new THREE.Group();
    rootGroup.add(spreadGroup);

    // Mid-tier Magenta Orbital Ring
    const midRingGeom = new THREE.TorusGeometry(1.45, 0.014, 16, 96);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const midRing = new THREE.Mesh(midRingGeom, midRingMat);
    spreadGroup.add(midRing);

    // Inner Cyan Aperture Ring
    const innerApertureGeom = new THREE.TorusGeometry(0.65, 0.012, 16, 64);
    const innerApertureMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const innerAperture = new THREE.Mesh(innerApertureGeom, innerApertureMat);
    spreadGroup.add(innerAperture);

    // Center focal micro-dot (open, non-clumping)
    const focalDotGeom = new THREE.SphereGeometry(0.04, 10, 10);
    const focalDotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const focalDot = new THREE.Mesh(focalDotGeom, focalDotMat);
    spreadGroup.add(focalDot);

    // ==========================================
    // 4. RADIATING CROSSHAIR VECTOR SPOKES (Bridging center to perimeter)
    // ==========================================
    const spokesGeom = new THREE.BufferGeometry();
    const spokePoints = new Float32Array([
      // Top Spoke (from R=0.65 to R=2.20)
      0, 0.65, 0, 0, 2.20, 0,
      // Bottom Spoke
      0, -0.65, 0, 0, -2.20, 0,
      // Left Spoke
      -0.65, 0, 0, -2.20, 0, 0,
      // Right Spoke
      0.65, 0, 0, 2.20, 0, 0,
      // Range notches on Spokes at R=1.45
      -0.08, 1.45, 0, 0.08, 1.45, 0,
      -0.08, -1.45, 0, 0.08, -1.45, 0,
      1.45, -0.08, 0, 1.45, 0.08, 0,
      -1.45, -0.08, 0, -1.45, 0.08, 0,
    ]);
    spokesGeom.setAttribute("position", new THREE.BufferAttribute(spokePoints, 3));
    const spokesMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
    });
    const spokesMesh = new THREE.LineSegments(spokesGeom, spokesMat);
    spreadGroup.add(spokesMesh);

    // 4 Diagonal Telemetry Nodes along the mid-ring (R=1.45)
    const diagNodesGeom = new THREE.BufferGeometry();
    const diagPoints: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      diagPoints.push(Math.cos(a) * 1.45, Math.sin(a) * 1.45, 0);
    }
    diagNodesGeom.setAttribute("position", new THREE.Float32BufferAttribute(diagPoints, 3));
    const diagNodesMat = new THREE.PointsMaterial({
      color: 0xec4899,
      size: 0.07,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const diagNodesMesh = new THREE.Points(diagNodesGeom, diagNodesMat);
    spreadGroup.add(diagNodesMesh);

    // ==========================================
    // 5. ORBITING DATA SATELLITE BEADS
    // ==========================================
    const sat1Geom = new THREE.SphereGeometry(0.058, 12, 12);
    const sat1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      blending: THREE.AdditiveBlending,
    });
    const sat1 = new THREE.Mesh(sat1Geom, sat1Mat);
    rootGroup.add(sat1);

    const sat1TrailGeom = new THREE.SphereGeometry(0.034, 8, 8);
    const sat1TrailMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const sat1Trail = new THREE.Mesh(sat1TrailGeom, sat1TrailMat);
    rootGroup.add(sat1Trail);

    const sat2Geom = new THREE.SphereGeometry(0.050, 12, 12);
    const sat2Mat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      blending: THREE.AdditiveBlending,
    });
    const sat2 = new THREE.Mesh(sat2Geom, sat2Mat);
    rootGroup.add(sat2);

    const sat2TrailGeom = new THREE.SphereGeometry(0.030, 8, 8);
    const sat2TrailMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
    });
    const sat2Trail = new THREE.Mesh(sat2TrailGeom, sat2TrailMat);
    rootGroup.add(sat2Trail);

    const sat3Geom = new THREE.SphereGeometry(0.042, 10, 10);
    const sat3Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      blending: THREE.AdditiveBlending,
    });
    const sat3 = new THREE.Mesh(sat3Geom, sat3Mat);
    hudGroup.add(sat3);

    // ==========================================
    // MOUSE TRACKING & PARALLAX
    // ==========================================
    const mouse = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    let animId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const t = (time - startTime) * 0.001;

      // Smooth mouse parallax lerp
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;

      rootGroup.rotation.x = mouse.currentY * 0.35;
      rootGroup.rotation.y = mouse.currentX * 0.45;

      // Axial Rotations
      mainRing.rotation.z += 0.002;
      accentRing.rotation.z -= 0.003;
      hudGroup.rotation.z -= 0.0018;

      // Subtle counter-rotation for mid-ring & spokes
      midRing.rotation.z -= 0.0025;
      innerAperture.rotation.z += 0.003;
      diagNodesMesh.rotation.z -= 0.0025;
      spokesMesh.rotation.z += 0.001;

      // Breathing pulses
      const pulse = 1 + Math.sin(t * 1.6) * 0.02;
      mainRing.scale.set(pulse, pulse, pulse);
      accentRing.scale.set(pulse, pulse, pulse);

      const midPulse = 1 + Math.sin(t * 2.0 + 1) * 0.025;
      midRing.scale.set(midPulse, midPulse, midPulse);

      // Satellite 1: Clockwise orbit on main ring (R=2.28)
      const a1 = t * 0.9;
      sat1.position.set(Math.cos(a1) * 2.28, Math.sin(a1) * 2.28, 0.02);
      const a1Trail = a1 - 0.08;
      sat1Trail.position.set(Math.cos(a1Trail) * 2.28, Math.sin(a1Trail) * 2.28, 0.02);

      // Satellite 2: Counter-clockwise orbit on inner rim (R=2.20)
      const a2 = -t * 0.7 + 1.6;
      sat2.position.set(Math.cos(a2) * 2.20, Math.sin(a2) * 2.20, -0.02);
      const a2Trail = a2 + 0.08;
      sat2Trail.position.set(Math.cos(a2Trail) * 2.20, Math.sin(a2Trail) * 2.20, -0.02);

      // Satellite 3: Faster orbit on outer HUD rail (R=2.50)
      const a3 = t * 1.15 + 3.14;
      sat3.position.set(Math.cos(a3) * 2.50, Math.sin(a3) * 2.50, 0.01);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);

      mainRingGeom.dispose();
      mainRingMat.dispose();
      accentRingGeom.dispose();
      accentRingMat.dispose();

      arcGeomList.forEach((g) => g.dispose());
      arcMat.dispose();
      tickGeom.dispose();
      tickMat.dispose();

      midRingGeom.dispose();
      midRingMat.dispose();
      innerApertureGeom.dispose();
      innerApertureMat.dispose();
      focalDotGeom.dispose();
      focalDotMat.dispose();
      spokesGeom.dispose();
      spokesMat.dispose();
      diagNodesGeom.dispose();
      diagNodesMat.dispose();

      sat1Geom.dispose();
      sat1Mat.dispose();
      sat1TrailGeom.dispose();
      sat1TrailMat.dispose();
      sat2Geom.dispose();
      sat2Mat.dispose();
      sat2TrailGeom.dispose();
      sat2TrailMat.dispose();
      sat3Geom.dispose();
      sat3Mat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div className="cards-holo-core-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="cards-holo-core-canvas" />
    </div>
  );
}
