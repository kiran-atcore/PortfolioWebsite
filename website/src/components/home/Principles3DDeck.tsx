"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export interface PrincipleItem {
  id: string;
  directive: string;
  num: string;
  title: string;
  tag: string;
  accentColor: string;
  icon: string;
  description: string;
  stats: { label: string; val: string }[];
  codeTag: string;
  hologramDetail: string;
}

export const PRINCIPLES_DATA: PrincipleItem[] = [
  {
    id: "latency",
    directive: "DIRECTIVE // 01",
    num: "01",
    title: "Sub-Second Performance",
    tag: "// LATENCY FIRST",
    accentColor: "#00f2fe",
    icon: "bi-speedometer2",
    description:
      "Optimizing compute pipelines, caching hot paths with distributed Redis layers, and engineering high-throughput inference with sub-second response times.",
    stats: [
      { label: "Target P99", val: "< 120ms" },
      { label: "Cache Hit Rate", val: "94.2%" },
      { label: "Throughput", val: "10k+ req/s" },
    ],
    codeTag: "SYS_OPTIMIZE // FAST_PATH",
    hologramDetail: "CORE RES: 4.8 GHz // TACHYON FLUX: NOMINAL",
  },
  {
    id: "fault-tolerant",
    directive: "DIRECTIVE // 02",
    num: "02",
    title: "Fault-Tolerant Systems",
    tag: "// RELIABILITY",
    accentColor: "#38f9d7",
    icon: "bi-shield-check",
    description:
      "Designing decoupled, stateless REST APIs and robust WebSocket architectures equipped with automated reconnection, graceful degradation, and zero downtime.",
    stats: [
      { label: "Availability SLA", val: "99.99%" },
      { label: "Failover Latency", val: "< 350ms" },
      { label: "Protocol State", val: "Stateless" },
    ],
    codeTag: "RESILIENCE // ZERO_CRASH",
    hologramDetail: "CAGE INTEGRITY: 100% // AUTO-HEAL: ACTIVE",
  },
  {
    id: "pragmatic-ai",
    directive: "DIRECTIVE // 03",
    num: "03",
    title: "Pragmatic AI Integration",
    tag: "// ENTERPRISE AI",
    accentColor: "#ff2a85",
    icon: "bi-cpu-fill",
    description:
      "Grounding LLMs and generative agents into enterprise workflows, automating complex business logic, and delivering deterministic, high-ROI intelligence.",
    stats: [
      { label: "Inference Engine", val: "Groq / Bedrock" },
      { label: "Schema Strictness", val: "100% JSON" },
      { label: "Automation", val: "Autonomous" },
    ],
    codeTag: "AGENTIC_CORE // PRODUCTION",
    hologramDetail: "SYNAPSE DENSITY: HIGH // DRIFT: 0.00%",
  },
];

interface Principles3DDeckProps {
  isExiting?: boolean;
}

export default function Principles3DDeck({ isExiting = false }: Principles3DDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMedium, setIsMedium] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isSmToMd, setIsSmToMd] = useState(false);
  const [isMdToLg, setIsMdToLg] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const targetColorRef = useRef(new THREE.Color(PRINCIPLES_DATA[0].accentColor));
  const currentColorRef = useRef(new THREE.Color(PRINCIPLES_DATA[0].accentColor));
  const intensityRef = useRef(1.0);
  const touchStartX = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const total = PRINCIPLES_DATA.length;
  const currentPrinciple = PRINCIPLES_DATA[displayIndex];

  const handleSwitch = useCallback((newIdx: number) => {
    if (newIdx === activeIndex) return;
    setIsGlitching(true);
    intensityRef.current = 3.5; // Projector lens surge on switch
    setActiveIndex(newIdx);
    setDisplayIndex(newIdx);
    targetColorRef.current.set(PRINCIPLES_DATA[newIdx].accentColor);

    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    handleSwitch((activeIndex - 1 + total) % total);
  }, [activeIndex, handleSwitch, total]);

  const handleNext = useCallback(() => {
    handleSwitch((activeIndex + 1) % total);
  }, [activeIndex, handleSwitch, total]);

  // Responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 992);
      setIsMedium(w >= 768 && w < 992);
      setIsSmall(w < 768);
      setIsSmToMd(w >= 576 && w < 768);
      setIsMdToLg(w >= 768 && w < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  // Three.js Holographic Projector Scene with Dynamic Screen-to-World Tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 6);

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(canvas.parentElement);

    // Screen to world unprojector at plane z = targetZ
    const tempVec = new THREE.Vector3();
    const screenToWorld = (screenX: number, screenY: number, targetZ = 0) => {
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((screenX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ndcY = -(((screenY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      tempVec.set(ndcX, ndcY, 0.5);
      tempVec.unproject(camera);
      const dir = tempVec.sub(camera.position).normalize();
      const dist = (targetZ - camera.position.z) / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(dist));
    };

    // Projector Assembly
    const projectorGroup = new THREE.Group();
    scene.add(projectorGroup);

    // Projector Base Pedestal
    const baseGeom = new THREE.CylinderGeometry(0.55, 0.65, 0.16, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x080b12,
      metalness: 0.9,
      roughness: 0.25,
    });
    const pedestal = new THREE.Mesh(baseGeom, baseMat);
    projectorGroup.add(pedestal);

    // Glowing Cyber Ring on Base Pedestal
    const ringGeom = new THREE.TorusGeometry(0.56, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const glowRing = new THREE.Mesh(ringGeom, ringMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.08;
    projectorGroup.add(glowRing);

    // Projector Turret (aims directly at card center in 3D)
    const projectorTurret = new THREE.Group();
    projectorTurret.position.y = 0.18;
    projectorGroup.add(projectorTurret);

    // Turret Body
    const turretBodyGeom = new THREE.BoxGeometry(0.55, 0.3, 0.45);
    const turretBody = new THREE.Mesh(turretBodyGeom, baseMat);
    projectorTurret.add(turretBody);

    // Turret Snout
    const barrelGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.28, 24);
    barrelGeom.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeom, baseMat);
    barrel.position.z = 0.3;
    projectorTurret.add(barrel);

    // Emitter Crystal Lens
    const lensGeom = new THREE.SphereGeometry(0.16, 24, 24);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.copy(barrel.position);
    lens.position.z += 0.1;
    lens.scale.set(1, 1, 0.35);
    projectorTurret.add(lens);

    // Lens Flare Aura
    const auraGeom = new THREE.PlaneGeometry(1.8, 1.8);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      map: createRadialGradient(),
      depthWrite: false,
    });
    const aura = new THREE.Mesh(auraGeom, auraMat);
    aura.position.copy(lens.position);
    aura.position.z += 0.06;
    projectorTurret.add(aura);

    // Volumetric Frustum (Pyramid of light from lens apex to card's 4 corners)
    const frustumUvs = new Float32Array([
      // Face 1 (Top): Apex, TL, TR
      0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Face 2 (Right): Apex, TR, BR
      0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Face 3 (Bottom): Apex, BR, BL
      0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Face 4 (Left): Apex, BL, TL
      0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Base plane 1 (TL, TR, BR)
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      // Base plane 2 (TL, BR, BL)
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]);
    const frustumGeom = new THREE.BufferGeometry();
    frustumGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(18 * 3), 3));
    frustumGeom.setAttribute("uv", new THREE.BufferAttribute(frustumUvs, 2));

    const frustumMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x00f2fe) },
        uTime: { value: 0 },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          // vUv.y: 0.0 at lens apex, 1.0 at card
          float beamFade = smoothstep(0.012, 0.2, vUv.y) * (1.0 - smoothstep(0.94, 1.0, vUv.y) * 0.25);
          
          // Edge glow on pyramid beam walls
          float edgeDist = abs(vUv.x - 0.5) * 2.0;
          float wallGlow = pow(edgeDist, 2.8) * 0.75 + pow(1.0 - edgeDist, 2.0) * 0.35;
          
          // High-speed scanline waves radiating from projector to card
          float pulses = sin(vUv.y * 55.0 - uTime * 18.0) * 0.25 + 0.75;
          
          // Quantum TV noise
          float noise = random(vUv * 3.5 + vec2(uTime * 0.12)) * 0.18;
          
          float alpha = beamFade * wallGlow * pulses * (0.85 + noise) * uIntensity;
          
          // Surge flash on card switch
          vec3 col = mix(uColor, vec3(1.0), clamp((uIntensity - 1.0) * 0.45, 0.0, 0.9));
          
          gl_FragColor = vec4(col, alpha * 0.62);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const frustumMesh = new THREE.Mesh(frustumGeom, frustumMat);
    scene.add(frustumMesh);

    // 4 Corner Laser Guide Rays + 1 Center Ray
    const createLine = (isCenter = false) => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const mat = new THREE.LineBasicMaterial({
        color: isCenter ? 0xffffff : 0x00f2fe,
        transparent: true,
        opacity: isCenter ? 0.4 : 0.75,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
      return { line, geom, mat };
    };

    const rayTL = createLine();
    const rayTR = createLine();
    const rayBR = createLine();
    const rayBL = createLine();
    const rayCenter = createLine(true);

    // Photonic Data Stream Particles (travel from lens directly to card face)
    const streamCount = 75;
    const streamData = Array.from({ length: streamCount }, () => ({
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.5,
      u: Math.random(),
      v: Math.random(),
    }));
    const streamPositions = new Float32Array(streamCount * 3);
    const streamGeom = new THREE.BufferGeometry();
    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    const streamMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streamPoints = new THREE.Points(streamGeom, streamMat);
    scene.add(streamPoints);

    // Ambient floating dust particles
    const ambCount = 80;
    const ambPositions = new Float32Array(ambCount * 3);
    for (let i = 0; i < ambCount * 3; i += 3) {
      ambPositions[i] = (Math.random() - 0.5) * 12;
      ambPositions[i + 1] = (Math.random() - 0.5) * 8;
      ambPositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const ambGeom = new THREE.BufferGeometry();
    ambGeom.setAttribute("position", new THREE.BufferAttribute(ambPositions, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const ambPoints = new THREE.Points(ambGeom, ambMat);
    scene.add(ambPoints);

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = y * 2;

      // Projector hover cursor feedback
      mouseNDC.x = x * 2;
      mouseNDC.y = -y * 2;
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(projectorGroup.children, true);
      canvas.style.cursor = intersects.length > 0 ? "pointer" : "default";
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'clientX' in e ? (e as MouseEvent).clientX : (e as TouchEvent).changedTouches[0].clientX;
      const clientY = 'clientY' in e ? (e as MouseEvent).clientY : (e as TouchEvent).changedTouches[0].clientY;
      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) return;
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(projectorGroup.children, true);
      if (intersects.length > 0) {
        handleNextRef.current();
      }
    };
    window.addEventListener("click", handlePointerDown);
    window.addEventListener("touchend", handlePointerDown);

    let animId: number;
    const clock = new THREE.Clock();
    const lastKnownCenter = new THREE.Vector3(1.5, 0.2, 0);
    const lastKnownTL = new THREE.Vector3(0.5, 1.2, 0);
    const lastKnownTR = new THREE.Vector3(2.5, 1.2, 0);
    const lastKnownBR = new THREE.Vector3(2.5, -0.8, 0);
    const lastKnownBL = new THREE.Vector3(0.5, -0.8, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read real-time screen bounds of card
      let pCenter = lastKnownCenter;
      let pTL = lastKnownTL;
      let pTR = lastKnownTR;
      let pBR = lastKnownBR;
      let pBL = lastKnownBL;

      if (cardRef.current && canvas.parentElement) {
        const cardRect = cardRef.current.getBoundingClientRect();
        if (cardRect.width > 20 && cardRect.height > 20) {
          pCenter = screenToWorld(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, 0);
          pTL = screenToWorld(cardRect.left, cardRect.top, 0);
          pTR = screenToWorld(cardRect.right, cardRect.top, 0);
          pBR = screenToWorld(cardRect.right, cardRect.bottom, 0);
          pBL = screenToWorld(cardRect.left, cardRect.bottom, 0);

          lastKnownCenter.copy(pCenter);
          lastKnownTL.copy(pTL);
          lastKnownTR.copy(pTR);
          lastKnownBR.copy(pBR);
          lastKnownBL.copy(pBL);
        }
      }

      // Parallax mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const isMobile = window.innerWidth < 992;
      const isSmall = window.innerWidth < 769;
      const canvasRect = canvas.getBoundingClientRect();

      // Position projector tucked securely into bottom-left corner just above the bottom navbar
      const projScreenX = canvasRect.left + (isSmall ? 42 : (isMobile ? 16 : 60));
      const projScreenY = canvasRect.bottom - (isSmall ? 28 : (isMobile ? 100 : 70));
      const projPos = screenToWorld(projScreenX, projScreenY, 0.2);
      projectorGroup.position.copy(projPos);

      // Dynamically scale projector to avoid crowding on smaller screens (<lg and <sm)
      const projScale = isSmall ? 0.45 : (isMobile ? 0.60 : (window.innerWidth < 1200 ? 0.70 : 0.85));
      projectorGroup.scale.setScalar(projScale);

      // Aim turret directly at card center (with subtle mouse parallax)
      const aimTarget = pCenter.clone();
      aimTarget.x += mouseRef.current.x * 0.4;
      aimTarget.y -= mouseRef.current.y * 0.3;
      projectorTurret.lookAt(aimTarget);

      // Lens world position
      const lensPos = new THREE.Vector3();
      lens.getWorldPosition(lensPos);

      // 1. Update Volumetric Frustum Vertices
      const fArr = frustumGeom.attributes.position.array as Float32Array;
      const setV = (idx: number, v: THREE.Vector3) => {
        fArr[idx] = v.x; fArr[idx + 1] = v.y; fArr[idx + 2] = v.z;
      };
      // Face 1 (Top)
      setV(0, lensPos); setV(3, pTL); setV(6, pTR);
      // Face 2 (Right)
      setV(9, lensPos); setV(12, pTR); setV(15, pBR);
      // Face 3 (Bottom)
      setV(18, lensPos); setV(21, pBR); setV(24, pBL);
      // Face 4 (Left)
      setV(27, lensPos); setV(30, pBL); setV(33, pTL);
      // Base plane (behind card)
      setV(36, pTL); setV(39, pTR); setV(42, pBR);
      setV(45, pTL); setV(48, pBR); setV(51, pBL);
      frustumGeom.attributes.position.needsUpdate = true;

      // 2. Update 4 Laser Guide Lines
      const updateLine = (lineObj: { geom: THREE.BufferGeometry }, start: THREE.Vector3, end: THREE.Vector3) => {
        const arr = lineObj.geom.attributes.position.array as Float32Array;
        arr[0] = start.x; arr[1] = start.y; arr[2] = start.z;
        arr[3] = end.x; arr[4] = end.y; arr[5] = end.z;
        lineObj.geom.attributes.position.needsUpdate = true;
      };
      updateLine(rayTL, lensPos, pTL);
      updateLine(rayTR, lensPos, pTR);
      updateLine(rayBR, lensPos, pBR);
      updateLine(rayBL, lensPos, pBL);
      updateLine(rayCenter, lensPos, pCenter);

      // 3. Update Photonic Data Stream Particles
      const sArr = streamGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        const item = streamData[i];
        item.t += item.speed * dt;
        if (item.t > 1) {
          item.t = 0;
          item.u = Math.random();
          item.v = Math.random();
        }
        const topLerp = new THREE.Vector3().lerpVectors(pTL, pTR, item.u);
        const btmLerp = new THREE.Vector3().lerpVectors(pBL, pBR, item.u);
        const cardTarget = new THREE.Vector3().lerpVectors(topLerp, btmLerp, item.v);
        const posAtT = new THREE.Vector3().lerpVectors(lensPos, cardTarget, item.t);

        sArr[i * 3] = posAtT.x;
        sArr[i * 3 + 1] = posAtT.y;
        sArr[i * 3 + 2] = posAtT.z;
      }
      streamGeom.attributes.position.needsUpdate = true;

      // Lerp colors & energy surge
      currentColorRef.current.lerp(targetColorRef.current, 0.08);
      lensMat.color.copy(currentColorRef.current);
      auraMat.color.copy(currentColorRef.current);
      glowRing.material.color.copy(currentColorRef.current);
      frustumMat.uniforms.uColor.value.copy(currentColorRef.current);
      rayTL.mat.color.copy(currentColorRef.current);
      rayTR.mat.color.copy(currentColorRef.current);
      rayBR.mat.color.copy(currentColorRef.current);
      rayBL.mat.color.copy(currentColorRef.current);
      rayCenter.mat.color.copy(currentColorRef.current);
      streamMat.color.copy(currentColorRef.current);

      intensityRef.current += (1.0 - intensityRef.current) * 0.08;
      frustumMat.uniforms.uIntensity.value = intensityRef.current;
      frustumMat.uniforms.uTime.value = elapsed;
      aura.scale.setScalar(1.0 + (intensityRef.current - 1.0) * 0.4);

      // Ambient particles slow rotation
      ambPoints.rotation.y = elapsed * 0.04;
      ambPoints.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handlePointerDown);
      window.removeEventListener("touchend", handlePointerDown);
      renderer.dispose();

      baseGeom.dispose();
      baseMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      turretBodyGeom.dispose();
      barrelGeom.dispose();
      lensGeom.dispose();
      lensMat.dispose();
      auraGeom.dispose();
      auraMat.dispose();
      frustumGeom.dispose();
      frustumMat.dispose();
      rayTL.geom.dispose(); rayTL.mat.dispose();
      rayTR.geom.dispose(); rayTR.mat.dispose();
      rayBR.geom.dispose(); rayBR.mat.dispose();
      rayBL.geom.dispose(); rayBL.mat.dispose();
      rayCenter.geom.dispose(); rayCenter.mat.dispose();
      streamGeom.dispose();
      streamMat.dispose();
      ambGeom.dispose();
      ambMat.dispose();
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 35) {
      if (deltaX > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const holoRgb = hexToRgb(currentPrinciple.accentColor);
  const isLargeOrMedium = isDesktop || isMedium;
  const isMobile = !isDesktop;

  return (
    <div
      className="principles-deck-wrapper w-100 position-relative mt-2 mt-md-4"
      style={{
        minHeight: isDesktop ? "360px" : (isMedium ? "390px" : (isSmall ? "320px" : "340px")),
        height: isDesktop ? "calc(100vh - 320px)" : (isMedium ? "calc(100vh - 240px)" : (isSmall ? "calc(100vh - 220px)" : "calc(100vh - 240px)")),
        maxHeight: isDesktop ? "460px" : (isMedium ? "510px" : (isSmall ? "480px" : "440px")),
        overflow: "visible",
        paddingBottom: isDesktop ? "20px" : "15px",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* CSS Styles for Hologram Glitch & CRT Static */}
      <style>{`
        .hologram-card {
          position: relative;
          background: linear-gradient(135deg, rgba(0, 20, 35, 0.35) 0%, rgba(0, 8, 18, 0.6) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px dashed rgba(var(--holo-color-rgb), 0.35);
          box-shadow: 0 0 35px var(--holo-color-alpha), inset 0 0 40px rgba(0, 0, 0, 0.6);
          border-radius: 6px;
          overflow: visible;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        /* CRT Scanline effect */
        .hologram-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.18),
            rgba(0, 0, 0, 0.18) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 10;
          border-radius: 6px;
        }

        /* Animated Hologram Sweep Beam */
        .holo-scan-overlay {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 6px;
          pointer-events: none;
          z-index: 12;
        }

        .holo-sweep-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--holo-color), transparent);
          box-shadow: 0 0 10px var(--holo-color);
          opacity: 0.65;
          animation: sweepDown 3.2s linear infinite;
          pointer-events: none;
        }

        @keyframes sweepDown {
          0% { top: 0%; opacity: 0; }
          12% { opacity: 0.85; }
          88% { opacity: 0.85; }
          100% { top: 100%; opacity: 0; }
        }

        /* Sci-Fi Hologram Corner Reticles where Laser Rays Touch */
        .holo-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
          z-index: 25;
        }
        .holo-corner::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          background: var(--holo-color);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--holo-color);
        }
        .holo-corner-tl { top: -2px; left: -2px; border-top: 2px solid var(--holo-color); border-left: 2px solid var(--holo-color); }
        .holo-corner-tl::after { top: -2px; left: -2px; }
        .holo-corner-tr { top: -2px; right: -2px; border-top: 2px solid var(--holo-color); border-right: 2px solid var(--holo-color); }
        .holo-corner-tr::after { top: -2px; right: -2px; }
        .holo-corner-br { bottom: -2px; right: -2px; border-bottom: 2px solid var(--holo-color); border-right: 2px solid var(--holo-color); }
        .holo-corner-br::after { bottom: -2px; right: -2px; }
        .holo-corner-bl { bottom: -2px; left: -2px; border-bottom: 2px solid var(--holo-color); border-left: 2px solid var(--holo-color); }
        .holo-corner-bl::after { bottom: -2px; left: -2px; }

        .glitch-anim {
          animation: rgb-split 0.15s infinite alternate;
        }

        @keyframes rgb-split {
          0% { text-shadow: -2px 0 rgba(255,0,0,0.7), 2px 0 rgba(0,255,255,0.7); transform: skewX(1deg); opacity: 0.8; }
          50% { text-shadow: 2px 0 rgba(255,0,0,0.7), -2px 0 rgba(0,255,255,0.7); transform: skewX(-1deg); opacity: 0.9; }
          100% { text-shadow: -1px 0 rgba(255,0,0,0.7), 1px 0 rgba(0,255,255,0.7); transform: skewX(0deg); opacity: 0.85; }
        }

        .hologram-glitch-active {
          animation: flicker 0.12s infinite;
          filter: contrast(1.4) saturate(1.4) hue-rotate(15deg);
        }

        @keyframes flicker {
          0% { opacity: 1; transform: translate(1px, -1px); }
          50% { opacity: 0.4; transform: translate(-1px, 2px); }
          100% { opacity: 0.9; transform: translate(0, 0); }
        }

      `}</style>

      {/* Three.js Canvas Background Layer */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <canvas ref={canvasRef} className="w-100 h-100" />
      </div>

      {/* Interactive UI Layer */}
      <div className="position-relative w-100 h-100 d-flex flex-column justify-content-between pb-2" style={{ zIndex: 1, pointerEvents: "none" }}>

        {/* Main Content Area */}
        <div
          className="flex-grow-1 d-flex align-items-center justify-content-end px-2 px-sm-3 px-lg-5 w-100"
          style={{ perspective: "1200px" }}
        >
          <div className="w-100 d-flex flex-column align-items-end" style={{ maxWidth: "1200px" }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPrinciple.id}
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.9, x: -20, y: 10 }}
                animate={{
                  opacity: isExiting ? 0 : 1,
                  scale: isExiting ? 0.85 : 1,
                  x: 0,
                  y: isGlitching ? [0, -2, 2, 0] : [-3, 3, -3],
                  rotateX: isDesktop ? [6, 8, 6] : [3, 5, 3],
                  rotateY: isDesktop ? [-12, -14, -12] : [-8, -10, -8],
                  rotateZ: isDesktop ? 1.5 : 0.5
                }}
                exit={{
                  opacity: 0,
                  scale: 0.88,
                  x: -20,
                  y: 10,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                transition={{
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                  y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                  rotateX: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                  rotateY: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                }}
                className={`hologram-card ${isLargeOrMedium ? 'p-3 p-xl-4' : 'p-2 p-sm-3'} ms-auto me-0 ${isGlitching ? 'hologram-glitch-active' : ''}`}
                style={{
                  width: "100%",
                  maxWidth: isDesktop ? "470px" : (isMedium ? "450px" : "340px"),
                  transformOrigin: "bottom left",
                  marginTop: isMdToLg ? "-76px" : (isSmToMd ? "0px" : "-40px"),
                  pointerEvents: "auto",
                  '--holo-color': currentPrinciple.accentColor,
                  '--holo-color-rgb': holoRgb,
                  '--holo-color-alpha': `${currentPrinciple.accentColor}25`,
                } as any}
              >
                {/* 4 Corner Laser Reticles */}
                <div className="holo-corner holo-corner-tl" />
                <div className="holo-corner holo-corner-tr" />
                <div className="holo-corner holo-corner-br" />
                <div className="holo-corner holo-corner-bl" />

                {/* Contained Sweeping Laser Scanline */}
                <div className="holo-scan-overlay">
                  <div className="holo-sweep-line" />
                </div>

                {/* Hologram Inner Content */}
                <div className={`position-relative ${isGlitching ? 'glitch-anim' : ''}`} style={{ zIndex: 15 }}>

                  {/* Telemetry Header Line */}
                  <div className="d-flex justify-content-between align-items-center mb-1 pb-1 border-bottom" style={{ borderColor: `rgba(${holoRgb}, 0.2)` }}>
                    <div className="font-mono text-uppercase" style={{ fontSize: isLargeOrMedium ? "0.58rem" : "0.52rem", color: currentPrinciple.accentColor, letterSpacing: "0.15em" }}>
                      <i className="bi bi-broadcast me-1"></i>
                      HOLO-LINK // BEAM LOCKED
                    </div>
                    <div className="font-mono text-white-50" style={{ fontSize: isLargeOrMedium ? "0.55rem" : "0.48rem" }}>
                      FREQ: 842.6 THz // 99.9%
                    </div>
                  </div>

                  {/* Directive & Tag */}
                  <div className="d-flex justify-content-between align-items-start align-items-sm-center flex-column flex-sm-row gap-1 gap-sm-2 mb-1 mb-sm-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{
                          width: isLargeOrMedium ? "36px" : "28px",
                          height: isLargeOrMedium ? "36px" : "28px",
                          background: `transparent`,
                          color: currentPrinciple.accentColor,
                          fontSize: isLargeOrMedium ? "1.2rem" : "0.95rem",
                          boxShadow: `inset 0 0 16px ${currentPrinciple.accentColor}30`,
                        }}
                      >
                        <i className={`bi ${currentPrinciple.icon}`}></i>
                      </div>
                      <div className="d-flex flex-column">
                        <span
                          className="font-michroma text-uppercase fw-bold"
                          style={{ fontSize: isLargeOrMedium ? "0.68rem" : "0.58rem", color: currentPrinciple.accentColor, letterSpacing: "0.12em" }}
                        >
                          {currentPrinciple.directive}
                        </span>
                        <span className="font-mono text-white-50" style={{ fontSize: isLargeOrMedium ? "0.58rem" : "0.5rem" }}>
                          {currentPrinciple.codeTag}
                        </span>
                      </div>
                    </div>

                    <span
                      className="badge rounded-pill font-mono px-2 px-sm-3 py-1 align-self-start align-self-sm-auto"
                      style={{
                        background: "transparent",
                        border: `1px solid ${currentPrinciple.accentColor}40`,
                        color: currentPrinciple.accentColor,
                        fontSize: isLargeOrMedium ? "0.62rem" : "0.52rem",
                        letterSpacing: "0.08em",
                        boxShadow: `inset 0 0 10px ${currentPrinciple.accentColor}20`,
                      }}
                    >
                      {currentPrinciple.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="font-syne h5 text-white text-uppercase tracking-wide mb-1 mt-1"
                    style={{
                      fontSize: isLargeOrMedium ? "1.1rem" : "0.9rem",
                      textShadow: `0 0 15px ${currentPrinciple.accentColor}60`
                    }}
                  >
                    {currentPrinciple.title}
                  </h3>
                  <p
                    className="font-oxanium text-light text-opacity-80 mb-2"
                    style={{
                      fontSize: isLargeOrMedium ? "0.8rem" : "0.7rem",
                      lineHeight: isLargeOrMedium ? "1.4" : "1.3",
                      letterSpacing: "0.015em"
                    }}
                  >
                    {currentPrinciple.description}
                  </p>

                  {/* Specs Matrix */}
                  <div className="row g-1 g-sm-2 pt-1 pt-sm-2 mt-1 border-top" style={{ borderColor: `rgba(${holoRgb}, 0.2)` }}>
                    {currentPrinciple.stats.map((st, sIdx) => (
                      <div key={sIdx} className="col-4">
                        <div
                          className="p-1 p-sm-2 text-center h-100 d-flex flex-column justify-content-center"
                          style={{
                            background: "transparent",
                            borderLeft: `2px solid ${currentPrinciple.accentColor}50`,
                          }}
                        >
                          <div
                            className="font-michroma fw-bold mb-0 mb-sm-1"
                            style={{ fontSize: isLargeOrMedium ? "0.8rem" : "0.68rem", color: currentPrinciple.accentColor }}
                          >
                            {st.val}
                          </div>
                          <div
                            className="font-oxanium text-white-50 text-uppercase text-truncate"
                            style={{ fontSize: isLargeOrMedium ? "0.55rem" : "0.48rem", letterSpacing: "0.04em" }}
                          >
                            {st.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>


          </div>
        </div>

      </div>
    </div>
  );
}

// Utility to convert hex color to RGB string
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// Utility to create radial gradient texture for lens flare
function createRadialGradient() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}
