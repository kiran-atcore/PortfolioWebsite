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
  const [isAmbientGlitch, setIsAmbientGlitch] = useState(false);
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

  // Timed random ambient holographic glitch (every 3.5 to 7.5 seconds, lasting ~160-240ms)
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let burstEndId: ReturnType<typeof setTimeout>;

    const scheduleNextGlitch = () => {
      // Balanced random interval between 3.5 and 7.5 seconds
      const randomDelay = 3500 + Math.random() * 4000;
      timerId = setTimeout(() => {
        setIsAmbientGlitch(true);
        // Quick subtle burst lasting 160ms - 240ms
        const burstDuration = 160 + Math.random() * 80;
        burstEndId = setTimeout(() => {
          setIsAmbientGlitch(false);
          scheduleNextGlitch();
        }, burstDuration);
      }, randomDelay);
    };

    scheduleNextGlitch();

    return () => {
      clearTimeout(timerId);
      clearTimeout(burstEndId);
    };
  }, []);

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

    // Physical Scene Lighting for Industrial PBR Materials
    const ambientLight = new THREE.AmbientLight(0x202b3a, 1.2);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xaad4ff, 1.8);
    rimLight.position.set(3, 5, 4);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0x0a1626, 0.8);
    bounceLight.position.set(-2, -3, 2);
    scene.add(bounceLight);

    // Projector Assembly
    const projectorGroup = new THREE.Group();
    scene.add(projectorGroup);

    // Ground Contact Shadow directly under base pedestal
    const shadowGeom = new THREE.CircleGeometry(0.72, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x010308,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.08;
    projectorGroup.add(groundShadow);

    // Procedural Optical & Atmospheric Textures
    const bokehTexture = createBokehTexture();
    const streakTexture = createAnamorphicStreakTexture();
    const ringTexture = createDiffractionRingTexture();
    const radialTexture = createRadialGradient();

    // Dynamic Ground Photonic Pool (radial floor bounce glow)
    const floorPoolGeom = new THREE.PlaneGeometry(2.4, 2.4);
    const floorPoolMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      map: radialTexture,
      depthWrite: false,
    });
    const floorPool = new THREE.Mesh(floorPoolGeom, floorPoolMat);
    floorPool.rotation.x = -Math.PI / 2;
    floorPool.position.y = -0.075;
    projectorGroup.add(floorPool);

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

    // Pure White-Hot Diode Core Emitter
    const diodeGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const diodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const diode = new THREE.Mesh(diodeGeom, diodeMat);
    diode.position.copy(lens.position);
    diode.position.z += 0.04;
    diode.scale.set(1, 1, 0.4);
    projectorTurret.add(diode);

    // Dynamic Diode Point Light from Emitter
    const diodeLight = new THREE.PointLight(0x00f2fe, 2.2, 5.0, 1.6);
    diodeLight.position.copy(lens.position);
    projectorTurret.add(diodeLight);

    // Card Ambient Back-Scatter Halo in 3D Scene
    const backScatterGeom = new THREE.PlaneGeometry(3.6, 2.6);
    const backScatterMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      map: radialTexture,
      depthWrite: false,
    });
    const backScatterMesh = new THREE.Mesh(backScatterGeom, backScatterMat);
    scene.add(backScatterMesh);

    // Primary Lens Flare Aura (Screen-Facing Camera Billboard)
    const auraGeom = new THREE.PlaneGeometry(1.8, 1.8);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      map: radialTexture,
      depthWrite: false,
    });
    const aura = new THREE.Mesh(auraGeom, auraMat);
    scene.add(aura);

    // Anamorphic Horizontal Lens Flare Streak (Cinematic Laser Optic)
    const streakGeom = new THREE.PlaneGeometry(3.6, 0.16);
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      map: streakTexture,
      depthWrite: false,
    });
    const streak = new THREE.Mesh(streakGeom, streakMat);
    scene.add(streak);

    // Secondary Optical Halo / Airy Diffraction Ring
    const ringFlareGeom = new THREE.PlaneGeometry(1.35, 1.35);
    const ringFlareMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      map: ringTexture,
      depthWrite: false,
    });
    const ringFlare = new THREE.Mesh(ringFlareGeom, ringFlareMat);
    scene.add(ringFlare);

    // Volumetric Frustum (Atmospheric Photonic Projection Field)
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

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          // 1. Dispersion & Distance Coordinate
          float edgeDist = abs(vUv.x - 0.5) * 2.0;

          // 2. Atmospheric Edge Dissolution & Zero-Border Feathering
          // Air micro-turbulence along cone edges
          float airEdgeTurbulence = noise(vec2(vUv.x * 7.0 + uTime * 0.35, vUv.y * 5.0 - uTime * 1.1)) * 0.12;
          float blurredEdge = clamp(edgeDist + airEdgeTurbulence * (1.0 - vUv.y * 0.3), 0.0, 1.0);

          // Feather smoothly to ABSOLUTE ZERO before the polygon boundary (no hard border or silhouette)
          float boundaryFeather = smoothstep(0.98, 0.48, blurredEdge);

          // 3. Volumetric Gaussian Penumbra (Intense radiant center, soft diffused hazy bloom)
          float gaussianCore = exp(-pow(edgeDist * 2.2, 2.0)) * 1.35;
          float atmosphericMist = pow(clamp(1.0 - edgeDist * 0.78, 0.0, 1.0), 1.7) * 0.75;
          float volumetricProfile = (gaussianCore + atmosphericMist) * boundaryFeather;

          // 4. Longitudinal Distance Attenuation & Card Clearance
          float apexBloom = smoothstep(0.008, 0.09, vUv.y);
          float distAtten = 1.0 / (0.75 + vUv.y * 2.2);

          // Card Clearance: cleanly dissolves the beam before reaching the card side so text remains crisp and unobstructed
          // Beam is vibrant near projector (vUv.y < 0.28) and smoothly dissipates to zero by vUv.y = 0.72
          float cardClearance = smoothstep(0.72, 0.25, vUv.y);
          float scatterEnvelope = apexBloom * distAtten * cardClearance;

          // 5. Soft Prismatic / Chromatic Dispersion in the Mist
          float chromaticSpread = smoothstep(0.20, 0.80, edgeDist);
          vec3 spectralFringe = vec3(
            sin(edgeDist * 2.6 + 0.35) * 0.5 + 0.5,
            sin(edgeDist * 2.6) * 0.5 + 0.5,
            sin(edgeDist * 2.6 - 0.35) * 0.5 + 0.5
          );
          vec3 beamColor = mix(uColor, spectralFringe, chromaticSpread * 0.28);

          // 6. Coherent Laser Shimmer, Interference Wavefront Ribs & Optical Turbulence
          float waveCarrier = sin(vUv.y * 50.0 - uTime * 18.0) * 0.10 + 0.90;
          float harmonicWave = sin(vUv.y * 15.0 - uTime * 6.5 + vUv.x * 5.0) * 0.08 + 0.92;

          // High-frequency coherent laser interference wavefront ribs (optical phase rings)
          float wavefrontRibs = sin(vUv.y * 120.0 - uTime * 22.0) * 0.10 + 0.90;
          float fineInterference = sin(vUv.y * 260.0 + vUv.x * 14.0 - uTime * 34.0) * 0.06 + 0.94;

          // Mie forward-scattering phase function approximation (intense luminous forward-propagation)
          float miePhase = 1.0 / pow(1.0 + 0.40 * edgeDist, 2.0);

          // Subtle laser speckle scintillation
          vec2 speckleCoord = vUv * vec2(50.0, 180.0) + vec2(uTime * 0.6, -uTime * 2.8);
          float speckle = hash(speckleCoord);
          float speckleMod = 0.90 + speckle * 0.20;

          // Soft ambient air turbulence
          float airTurbulence = noise(vec2(vUv.x * 4.0, vUv.y * 6.0 - uTime * 0.9)) * 0.10;

          // 7. Axial High-Density Core Beam
          float axialCore = pow(1.0 - edgeDist, 5.0) * (1.0 - vUv.y * 0.55) * 0.55;

          // Composite Volumetric Alpha with Deep Feather, Mie Phase, and Coherent Wavefront Ribs
          float finalAlpha = scatterEnvelope * (volumetricProfile + axialCore * boundaryFeather) * waveCarrier * harmonicWave * wavefrontRibs * fineInterference * (speckleMod + airTurbulence) * miePhase * uIntensity;

          // 8. Blinding Hot-Spot Core & Surge Flash
          float apexWhiteBurn = pow(1.0 - clamp(vUv.y / 0.15, 0.0, 1.0), 2.2) * 0.95;
          float surgeWhite = clamp((uIntensity - 1.0) * 0.55, 0.0, 0.95);
          vec3 finalRgb = mix(beamColor, vec3(1.0, 1.0, 1.0), clamp(apexWhiteBurn + surgeWhite, 0.0, 1.0));

          gl_FragColor = vec4(finalRgb, finalAlpha * 0.72);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const frustumMesh = new THREE.Mesh(frustumGeom, frustumMat);
    scene.add(frustumMesh);

    // Subtle Ethereal Optical Alignment Filaments (faint tracer paths, zero solid border)
    const createLine = (isCenter = false) => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const mat = new THREE.LineBasicMaterial({
        color: isCenter ? 0xffffff : 0x00f2fe,
        transparent: true,
        opacity: isCenter ? 0.3 : 0.10,
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

    // Laser Guide Corner Impact Hotspots (Photonic ionization where rays strike card)
    const cornerHotspotGeom = new THREE.BufferGeometry();
    const cornerPositions = new Float32Array(4 * 3);
    cornerHotspotGeom.setAttribute("position", new THREE.BufferAttribute(cornerPositions, 3));
    const cornerHotspotMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.14,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: bokehTexture,
    });
    const cornerHotspots = new THREE.Points(cornerHotspotGeom, cornerHotspotMat);
    scene.add(cornerHotspots);

    // Photonic Data Stream Particles (travel from lens directly to card face)
    const streamCount = 95;
    const streamData = Array.from({ length: streamCount }, () => ({
      t: Math.random(),
      speed: 0.38 + Math.random() * 0.55,
      u: Math.random(),
      v: Math.random(),
    }));
    const streamPositions = new Float32Array(streamCount * 3);
    const streamGeom = new THREE.BufferGeometry();
    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    const streamMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: bokehTexture,
    });
    const streamPoints = new THREE.Points(streamGeom, streamMat);
    scene.add(streamPoints);

    // Ambient floating dust particles (illuminated in ambient atmosphere)
    const ambCount = 85;
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
      size: 0.04,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: bokehTexture,
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
    const timer = new THREE.Timer();
    const lastKnownCenter = new THREE.Vector3(1.5, 0.2, 0);
    const lastKnownTL = new THREE.Vector3(0.5, 1.2, 0);
    const lastKnownTR = new THREE.Vector3(2.5, 1.2, 0);
    const lastKnownBR = new THREE.Vector3(2.5, -0.8, 0);
    const lastKnownBL = new THREE.Vector3(0.5, -0.8, 0);

    const animate = (timestamp?: number) => {
      animId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const dt = timer.getDelta();
      const elapsed = timer.getElapsed();

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
      // Base plane (behind card) - zeroed out so no glowing geometry sits behind the card text
      fArr[36] = 0; fArr[37] = 0; fArr[38] = 0;
      fArr[39] = 0; fArr[40] = 0; fArr[41] = 0;
      fArr[42] = 0; fArr[43] = 0; fArr[44] = 0;
      fArr[45] = 0; fArr[46] = 0; fArr[47] = 0;
      fArr[48] = 0; fArr[49] = 0; fArr[50] = 0;
      fArr[51] = 0; fArr[52] = 0; fArr[53] = 0;
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

      // Update Laser Guide Corner Impact Hotspots
      const cArr = cornerHotspotGeom.attributes.position.array as Float32Array;
      cArr[0] = pTL.x; cArr[1] = pTL.y; cArr[2] = pTL.z + 0.01;
      cArr[3] = pTR.x; cArr[4] = pTR.y; cArr[5] = pTR.z + 0.01;
      cArr[6] = pBR.x; cArr[7] = pBR.y; cArr[8] = pBR.z + 0.01;
      cArr[9] = pBL.x; cArr[10] = pBL.y; cArr[11] = pBL.z + 0.01;
      cornerHotspotGeom.attributes.position.needsUpdate = true;

      // 3. Update Photonic Data Stream Particles
      const sArr = streamGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        const item = streamData[i];
        item.t += item.speed * dt;
        // Dissolve particles before reaching card text
        if (item.t > 0.72) {
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

      // Align Screen-Facing Lens Flare Optics with Camera
      aura.position.copy(lensPos);
      aura.quaternion.copy(camera.quaternion);

      streak.position.copy(lensPos);
      streak.quaternion.copy(camera.quaternion);

      ringFlare.position.copy(lensPos);
      ringFlare.quaternion.copy(camera.quaternion);

      // Lerp colors & energy surge
      currentColorRef.current.lerp(targetColorRef.current, 0.08);
      lensMat.color.copy(currentColorRef.current);
      auraMat.color.copy(currentColorRef.current);
      streakMat.color.copy(currentColorRef.current);
      ringFlareMat.color.copy(currentColorRef.current);
      glowRing.material.color.copy(currentColorRef.current);
      frustumMat.uniforms.uColor.value.copy(currentColorRef.current);
      rayTL.mat.color.copy(currentColorRef.current);
      rayTR.mat.color.copy(currentColorRef.current);
      rayBR.mat.color.copy(currentColorRef.current);
      rayBL.mat.color.copy(currentColorRef.current);
      rayCenter.mat.color.copy(currentColorRef.current);
      streamMat.color.copy(currentColorRef.current);
      cornerHotspotMat.color.copy(currentColorRef.current);

      // Soft, ethereal laser alignment traces (faint optical filaments, never obscuring card)
      const rayShimmer = 0.06 + Math.sin(elapsed * 12.0) * 0.02;
      rayTL.mat.opacity = rayShimmer;
      rayTR.mat.opacity = rayShimmer;
      rayBR.mat.opacity = rayShimmer;
      rayBL.mat.opacity = rayShimmer;
      rayCenter.mat.opacity = 0.12 + Math.sin(elapsed * 8.0) * 0.03;

      intensityRef.current += (1.0 - intensityRef.current) * 0.08;
      frustumMat.uniforms.uIntensity.value = intensityRef.current;
      frustumMat.uniforms.uTime.value = elapsed;

      // Dynamically scale optics based on screen scale and intensity surges
      aura.scale.setScalar((1.0 + (intensityRef.current - 1.0) * 0.4) * projScale * 1.15);
      streak.scale.set(
        (1.0 + (intensityRef.current - 1.0) * 0.75 + Math.sin(elapsed * 8.0) * 0.03) * projScale * 1.1,
        (1.0 + (intensityRef.current - 1.0) * 0.45) * projScale * 1.1,
        1.0
      );
      streakMat.opacity = (0.75 + (intensityRef.current - 1.0) * 0.22);
      ringFlare.scale.setScalar((1.0 + (intensityRef.current - 1.0) * 0.3 + Math.sin(elapsed * 4.0) * 0.04) * projScale * 1.05);
      cornerHotspotMat.size = (0.16 + (intensityRef.current - 1.0) * 0.1) * projScale;

      // Dynamically update diode point light, ground pool bounce, and card backscatter
      diodeLight.color.copy(currentColorRef.current);
      diodeLight.intensity = (2.0 + (intensityRef.current - 1.0) * 1.5) * projScale;

      floorPoolMat.color.copy(currentColorRef.current);
      floorPoolMat.opacity = (0.34 + (intensityRef.current - 1.0) * 0.22) * projScale;
      floorPool.scale.setScalar((1.0 + (intensityRef.current - 1.0) * 0.35) * projScale);

      backScatterMesh.position.set(pCenter.x, pCenter.y, pCenter.z - 0.25);
      backScatterMesh.quaternion.copy(camera.quaternion);
      backScatterMat.color.copy(currentColorRef.current);
      backScatterMat.opacity = 0.15 + (intensityRef.current - 1.0) * 0.08;

      // Ambient particles slow rotation
      ambPoints.rotation.y = elapsed * 0.04;
      ambPoints.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      timer.dispose();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handlePointerDown);
      window.removeEventListener("touchend", handlePointerDown);
      renderer.dispose();

      baseGeom.dispose();
      baseMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
      floorPoolGeom.dispose();
      floorPoolMat.dispose();
      diodeLight.dispose();
      backScatterGeom.dispose();
      backScatterMat.dispose();
      turretBodyGeom.dispose();
      barrelGeom.dispose();
      lensGeom.dispose();
      lensMat.dispose();
      diodeGeom.dispose();
      diodeMat.dispose();
      auraGeom.dispose();
      auraMat.dispose();
      streakGeom.dispose();
      streakMat.dispose();
      ringFlareGeom.dispose();
      ringFlareMat.dispose();
      frustumGeom.dispose();
      frustumMat.dispose();
      rayTL.geom.dispose(); rayTL.mat.dispose();
      rayTR.geom.dispose(); rayTR.mat.dispose();
      rayBR.geom.dispose(); rayBR.mat.dispose();
      rayBL.geom.dispose(); rayBL.mat.dispose();
      rayCenter.geom.dispose(); rayCenter.mat.dispose();
      cornerHotspotGeom.dispose();
      cornerHotspotMat.dispose();
      streamGeom.dispose();
      streamMat.dispose();
      ambGeom.dispose();
      ambMat.dispose();
      bokehTexture.dispose();
      streakTexture.dispose();
      ringTexture.dispose();
      radialTexture.dispose();
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
  const isAnyGlitch = isGlitching || isAmbientGlitch;

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
          transform-style: preserve-3d;
          background: linear-gradient(135deg, rgba(6, 16, 28, 0.44) 0%, rgba(2, 7, 16, 0.58) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(var(--holo-color-rgb), 0.26);
          border-radius: 8px;
          overflow: visible;
          /* Multi-tier blurred optical bloom with subtle chromatic aberration dispersion */
          box-shadow: 
            0 0 0 1px rgba(var(--holo-color-rgb), 0.20),
            -1.5px 0 8px rgba(255, 42, 133, 0.16),
            1.5px 0 8px rgba(0, 242, 254, 0.20),
            0 0 18px 2px rgba(var(--holo-color-rgb), 0.22),
            0 0 42px 8px rgba(var(--holo-color-rgb), 0.10),
            0 0 70px 16px rgba(var(--holo-color-rgb), 0.04),
            inset 0 0 24px rgba(var(--holo-color-rgb), 0.09),
            inset 0 0 45px rgba(0, 0, 0, 0.55);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        /* Optical border blur & perimeter dissipation to blend container seamlessly into projection */
        .holo-edge-blur {
          position: absolute;
          inset: -3px;
          border-radius: 10px;
          pointer-events: none;
          z-index: 2;
          background: transparent;
          border: 2px solid rgba(var(--holo-color-rgb), 0.35);
          filter: blur(4px);
          opacity: 0.85;
          transition: border-color 0.4s ease, opacity 0.4s ease;
        }

        /* Secondary outer diffuse blur ring */
        .holo-edge-blur::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 14px;
          border: 2px solid rgba(var(--holo-color-rgb), 0.18);
          filter: blur(8px);
          pointer-events: none;
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
          opacity: 0.85;
          transform: translateZ(24px);
          filter: drop-shadow(0 0 6px var(--holo-color));
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

        /* Randomized Ambient Glitch Burst */
        .holo-glitch-active-burst {
          animation: ambient-burst 0.22s steps(2, end) forwards;
          will-change: transform, filter;
        }

        @keyframes ambient-burst {
          0% {
            transform: translate3d(0, 0, 0) skewX(0deg);
            filter: none;
          }
          25% {
            transform: translate3d(-3px, 1px, 0) skewX(1.2deg);
            filter: drop-shadow(-3px 0 rgba(255, 42, 133, 0.8)) drop-shadow(3px 0 rgba(0, 242, 254, 0.8));
          }
          50% {
            transform: translate3d(3px, -1px, 0) skewX(-1.5deg);
            filter: drop-shadow(3px 0 rgba(255, 42, 133, 0.9)) drop-shadow(-3px 0 rgba(0, 242, 254, 0.9)) brightness(1.15);
          }
          75% {
            transform: translate3d(-1px, 1px, 0) skewX(0.5deg);
            filter: contrast(1.2) brightness(0.9);
          }
          100% {
            transform: translate3d(0, 0, 0);
            filter: none;
          }
        }

        /* Periodic Hologram Horizontal Glitch Slice / Tear Overlay */
        .holo-glitch-slice {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          pointer-events: none;
          z-index: 18;
          opacity: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(var(--holo-color-rgb), 0.20) 25%,
            rgba(255, 42, 133, 0.25) 50%,
            rgba(0, 242, 254, 0.30) 75%,
            transparent 100%
          );
          mix-blend-mode: screen;
        }

        .holo-glitch-slice.active {
          animation: slice-burst 0.22s steps(1, end) forwards;
        }

        @keyframes slice-burst {
          0% {
            opacity: 0.9;
            clip-path: inset(25% 0 60% 0);
            transform: translateX(-5px);
          }
          33% {
            opacity: 0.75;
            clip-path: inset(50% 0 30% 0);
            transform: translateX(6px);
          }
          66% {
            opacity: 0.85;
            clip-path: inset(70% 0 10% 0);
            transform: translateX(-3px);
          }
          100% {
            opacity: 0;
            clip-path: inset(0 0 0 0);
            transform: translateX(0);
          }
        }

        /* High-speed scanline sync jitter */
        .holo-scanline-glitch {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          pointer-events: none;
          z-index: 14;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.4) 0px,
            rgba(0, 0, 0, 0.4) 1px,
            transparent 1px,
            transparent 3px
          );
          opacity: 0;
        }

        .holo-scanline-glitch.active {
          opacity: 0.75;
          animation: scanline-flicker 0.22s steps(2, end) forwards;
        }

        @keyframes scanline-flicker {
          0% { opacity: 0.8; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }

        .glitch-anim {
          animation: rgb-split 0.12s infinite alternate;
        }

        @keyframes rgb-split {
          0% { text-shadow: -3px 0 rgba(255,0,85,0.8), 3px 0 rgba(0,255,255,0.8); transform: skewX(1.5deg); opacity: 0.8; }
          50% { text-shadow: 3px 0 rgba(255,0,85,0.8), -3px 0 rgba(0,255,255,0.8); transform: skewX(-1.5deg); opacity: 0.95; }
          100% { text-shadow: -2px 0 rgba(255,0,85,0.8), 2px 0 rgba(0,255,255,0.8); transform: skewX(0.5deg); opacity: 0.85; }
        }

        .hologram-glitch-active {
          animation: flicker 0.10s infinite;
          filter: contrast(1.4) saturate(1.4) hue-rotate(15deg);
        }

        @keyframes flicker {
          0% { opacity: 1; transform: translate(2px, -1px); }
          50% { opacity: 0.35; transform: translate(-2px, 2px); }
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
                {/* Blurred Optical Border Halo to blend into projection */}
                <div className="holo-edge-blur" />

                {/* 4 Corner Laser Reticles */}
                <div className="holo-corner holo-corner-tl" />
                <div className="holo-corner holo-corner-tr" />
                <div className="holo-corner holo-corner-br" />
                <div className="holo-corner holo-corner-bl" />

                {/* Contained Sweeping Laser Scanline */}
                <div className="holo-scan-overlay">
                  <div className="holo-sweep-line" />
                </div>

                {/* Ambient Hologram Glitch Slice & Scanline Jitter Overlays (Timed Random & Infrequent) */}
                <div className={`holo-glitch-slice ${isAnyGlitch ? 'active' : ''}`} />
                <div className={`holo-scanline-glitch ${isAnyGlitch ? 'active' : ''}`} />

                {/* Hologram Inner Content */}
                <div
                  className={`position-relative ${isAmbientGlitch ? 'holo-glitch-active-burst' : ''} ${isGlitching ? 'glitch-anim' : ''}`}
                  style={{ zIndex: 15, transformStyle: "preserve-3d" }}
                >

                  {/* Telemetry Header Line */}
                  <div
                    className="d-flex justify-content-between align-items-center mb-1 pb-1 border-bottom"
                    style={{
                      borderColor: `rgba(${holoRgb}, 0.2)`,
                      transform: "translateZ(8px)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="font-space-grotesk text-uppercase" style={{ fontSize: isLargeOrMedium ? "0.58rem" : "0.52rem", color: currentPrinciple.accentColor, letterSpacing: "0.15em" }}>
                      <i className="bi bi-broadcast me-1"></i>
                      HOLO-LINK // BEAM LOCKED
                    </div>
                    <div className="font-space-grotesk text-white-50" style={{ fontSize: isLargeOrMedium ? "0.55rem" : "0.48rem" }}>
                      FREQ: 842.6 THz // 99.9%
                    </div>
                  </div>

                  {/* Directive & Tag */}
                  <div
                    className="d-flex justify-content-between align-items-start align-items-sm-center flex-column flex-sm-row gap-1 gap-sm-2 mb-1 mb-sm-2"
                    style={{
                      transform: "translateZ(18px)",
                      transformStyle: "preserve-3d",
                    }}
                  >
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
                          className="font-space-grotesk text-uppercase fw-bold"
                          style={{ fontSize: isLargeOrMedium ? "0.88rem" : "0.78rem", color: currentPrinciple.accentColor, letterSpacing: "0.2em" }}
                        >
                          {currentPrinciple.directive}
                        </span>
                        <span className="font-outfit text-white-50" style={{ fontSize: isLargeOrMedium ? "0.58rem" : "0.5rem" }}>
                          {currentPrinciple.codeTag}
                        </span>
                      </div>
                    </div>

                    <span
                      className="badge rounded-pill font-space-grotesk px-2 px-sm-3 py-1 align-self-start align-self-sm-auto"
                      style={{
                        background: "transparent",
                        border: `1px solid ${currentPrinciple.accentColor}40`,
                        color: currentPrinciple.accentColor,
                        fontSize: isLargeOrMedium ? "0.62rem" : "0.52rem",
                        letterSpacing: "0.08em",
                        boxShadow: `inset 0 0 10px ${currentPrinciple.accentColor}20`,
                        transform: "translateZ(16px)",
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
                      textShadow: `0 0 15px ${currentPrinciple.accentColor}60`,
                      transform: "translateZ(22px)",
                    }}
                  >
                    {currentPrinciple.title}
                  </h3>
                  <p
                    className="font-outfit fw-light text-light text-opacity-80 mb-2"
                    style={{
                      fontSize: isLargeOrMedium ? "0.8rem" : "0.7rem",
                      lineHeight: isLargeOrMedium ? "1.4" : "1.3",
                      letterSpacing: "0.018em",
                      transform: "translateZ(10px)",
                    }}
                  >
                    {currentPrinciple.description}
                  </p>

                  {/* Specs Matrix */}
                  <div
                    className="row g-1 g-sm-2 pt-1 pt-sm-2 mt-1 border-top"
                    style={{
                      borderColor: `rgba(${holoRgb}, 0.2)`,
                      transform: "translateZ(16px)",
                      transformStyle: "preserve-3d",
                    }}
                  >
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
                            className="font-syncopate fw-light mb-0 mb-sm-1"
                            style={{ fontSize: isLargeOrMedium ? "0.7rem" : "0.58rem", color: currentPrinciple.accentColor }}
                          >
                            {st.val}
                          </div>
                          <div
                            className="font-outfit text-white-50 text-uppercase text-truncate"
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
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.08, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.24, "rgba(255, 255, 255, 0.45)");
    gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Procedural soft radial bokeh texture for particles
function createBokehTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.55, "rgba(255, 255, 255, 0.25)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Procedural anamorphic lens flare horizontal streak
function createAnamorphicStreakTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 512, 64);
    const hGrad = ctx.createLinearGradient(0, 32, 512, 32);
    hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    hGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.08)");
    hGrad.addColorStop(0.42, "rgba(255, 255, 255, 0.45)");
    hGrad.addColorStop(0.49, "rgba(255, 255, 255, 0.95)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
    hGrad.addColorStop(0.51, "rgba(255, 255, 255, 0.95)");
    hGrad.addColorStop(0.58, "rgba(255, 255, 255, 0.45)");
    hGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.08)");
    hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    const vGrad = ctx.createLinearGradient(256, 0, 256, 64);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vGrad.addColorStop(0.38, "rgba(255, 255, 255, 0.7)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
    vGrad.addColorStop(0.62, "rgba(255, 255, 255, 0.7)");
    vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, 512, 64);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, 512, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Procedural concentric optical diffraction rings (Airy disk)
function createDiffractionRingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.32, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.44, "rgba(255, 255, 255, 0.35)");
    grad.addColorStop(0.49, "rgba(255, 255, 255, 0.8)");
    grad.addColorStop(0.52, "rgba(255, 255, 255, 0.4)");
    grad.addColorStop(0.68, "rgba(255, 255, 255, 0.2)");
    grad.addColorStop(0.74, "rgba(255, 255, 255, 0)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
