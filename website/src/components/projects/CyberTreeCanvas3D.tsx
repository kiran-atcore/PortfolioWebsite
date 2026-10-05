"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "@/data/portfolioData";
import ProjectBentoCard from "./ProjectBentoCard";

interface CyberTreeCanvas3DProps {
  projects: ProjectItem[];
}

export default function CyberTreeCanvas3D({ projects }: CyberTreeCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const scrubberThumbRef = useRef<HTMLDivElement>(null);
  const scrubberFillRef = useRef<HTMLDivElement>(null);
  const stepProjectRef = useRef<((dir: number) => void) | null>(null);
  const jumpToProgressRef = useRef<((pct: number) => void) | null>(null);
  const tetherPathsRef = useRef<(SVGPathElement | null)[]>([]);

  const projectCount = Math.max(projects.length, 1);

  // Sync state with ref for animation loop
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Reset when project list changes
  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
  }, [projects]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.08);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);
    camera.lookAt(0, 0, 0);

    // Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc084fc, 2.0);
    keyLight.position.set(-4, 6, 3);
    scene.add(keyLight);

    const trunkPointLight = new THREE.PointLight(0x00f2fe, 2.8, 8);
    trunkPointLight.position.set(-1.85, 0, 1.2);
    scene.add(trunkPointLight);

    const branchSpotLight = new THREE.PointLight(0x38bdf8, 2.2, 7);
    branchSpotLight.position.set(1.0, 0.2, 1.4);
    scene.add(branchSpotLight);

    // Cyber Matrix Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x00f2fe, 0xc084fc);
    gridHelper.position.y = -5.5;
    (gridHelper.material as THREE.Material).opacity = 0.08;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // Resource tracker for clean disposal
    const disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[]; textures: THREE.Texture[] } = {
      geometries: [],
      materials: [],
      textures: []
    };

    const registerGeom = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.geometries.push(g);
      return g;
    };
    const registerMat = <T extends THREE.Material>(m: T): T => {
      disposables.materials.push(m);
      return m;
    };

    // Procedural Organic Bark Bump Map Generator
    const createBarkTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#121e2c";
      ctx.fillRect(0, 0, 256, 256);

      // Vertical organic bark striations
      for (let i = 0; i < 75; i++) {
        const x = Math.random() * 256;
        const w = 2 + Math.random() * 6;
        const alpha = 0.12 + Math.random() * 0.25;
        ctx.fillStyle = i % 2 === 0 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha * 1.6})`;
        ctx.fillRect(x, 0, w, 256);
      }

      // Natural wood fissures and knothole curves
      for (let i = 0; i < 35; i++) {
        const y = Math.random() * 256;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(80, y + (Math.random() - 0.5) * 20, 180, y + (Math.random() - 0.5) * 20, 256, y);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 6);
      return texture;
    };

    const barkTexture = createBarkTexture();
    if (barkTexture) disposables.textures.push(barkTexture);

    // Ancient Mystical Wood Bark Material
    const barkMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x091c33,
      roughness: 0.82,
      metalness: 0.14,
      bumpMap: barkTexture || undefined,
      bumpScale: 0.045,
    }));

    // Bioluminescent Vascular Cambium Sap Veins
    const cyanSapMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.8,
    }));

    const violetSapMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xc084fc,
      emissiveIntensity: 2.0,
      roughness: 0.2,
      metalness: 0.8,
    }));

    // Shimmering Fantasy Foliage (Crystal Leaves)
    const emeraldFoliageMat = registerMat(new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }));

    const cyanFoliageMat = registerMat(new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    }));

    // Weeping Willow Light Streamers (Avatar Style)
    const weepingTendrilMat = registerMat(new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    }));

    const creeperMat = registerMat(new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.7,
      metalness: 0.1,
    }));

    const wireMat = registerMat(new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    }));

    const createSplineTube = (
      points: THREE.Vector3[],
      radius: number,
      mat: THREE.Material,
      parent: THREE.Group,
      segments: number = 32
    ) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geom = registerGeom(new THREE.TubeGeometry(curve, segments, radius, 24, false));
      const mesh = new THREE.Mesh(geom, mat);
      parent.add(mesh);
      return mesh;
    };

    // 1. SOLID BRAIDED TRUNK AND ROTATING TREE GROUP
    const treeGroup = new THREE.Group();
    // Shift tree trunk to the left of canvas so branches swing through center-right
    treeGroup.position.x = -2.3;
    scene.add(treeGroup);

    const trunkGroup = new THREE.Group();
    treeGroup.add(trunkGroup);

    const trunkBaseX = 0; // Relative to treeGroup

    // Solid central wood trunk core (Flared at base)
    const trunkCorePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 36; i++) {
      const y = -7.5 + (i / 36) * 15.0;
      const swayX = Math.sin(y * 0.4) * 0.12;
      const swayZ = Math.cos(y * 0.35) * 0.08;
      trunkCorePts.push(new THREE.Vector3(trunkBaseX + swayX, y, swayZ));
    }
    // Wider trunk: radius 0.35 at base tapering slightly
    const trunkCurve = new THREE.CatmullRomCurve3(trunkCorePts);
    class FlaredTubeGeometry extends THREE.TubeGeometry {
      constructor(path: THREE.Curve<THREE.Vector3>, tubularSegments: number, radius: number, radialSegments: number, closed: boolean) {
        super(path, tubularSegments, radius, radialSegments, closed);
        const pos = this.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          // Flare the base out below y = -4
          if (y < -4) {
            const flare = Math.pow((-4 - y) * 0.3, 2);
            const r = 1 + flare;
            // Get vector from center of trunk at this y
            const cx = trunkBaseX + Math.sin(y * 0.4) * 0.12;
            const cz = Math.cos(y * 0.35) * 0.08;
            pos.setX(i, cx + (pos.getX(i) - cx) * r);
            pos.setZ(i, cz + (pos.getZ(i) - cz) * r);
          }
        }
        this.computeVertexNormals();
      }
    }
    const trunkGeom = registerGeom(new FlaredTubeGeometry(trunkCurve, 48, 0.35, 24, false));
    const trunkMesh = new THREE.Mesh(trunkGeom, barkMat);
    trunkGroup.add(trunkMesh);

    // 4 Intertwining Gnarled Woody Boughs
    for (let v = 0; v < 4; v++) {
      const vPhase = (v / 4) * Math.PI * 2;
      const vRadius = 0.36 + (v % 2 === 0 ? 0.04 : -0.02);
      const vPts: THREE.Vector3[] = [];

      for (let step = 0; step <= 48; step++) {
        const y = -7.5 + (step / 48) * 15.0;
        const angle = y * 1.4 + vPhase;
        const swayX = Math.sin(y * 0.4) * 0.12;
        const swayZ = Math.cos(y * 0.35) * 0.08;
        vPts.push(new THREE.Vector3(
          trunkBaseX + Math.cos(angle) * vRadius + swayX,
          y,
          Math.sin(angle) * vRadius + swayZ
        ));
      }
      createSplineTube(vPts, 0.12, barkMat, trunkGroup, 48); // Thicker boughs
      const sapMat = v % 2 === 0 ? cyanSapMat : violetSapMat;
      createSplineTube(vPts, 0.025, sapMat, trunkGroup, 48);
    }

    // 6 Fine Luminous Cyber Wires
    for (let w = 0; w < 6; w++) {
      const wPhase = (w / 6) * Math.PI * 2;
      const wPts: THREE.Vector3[] = [];
      for (let step = 0; step <= 36; step++) {
        const y = -7.5 + (step / 36) * 15.0;
        const angle = y * -2.2 + wPhase;
        const swayX = Math.sin(y * 0.4) * 0.12;
        const swayZ = Math.cos(y * 0.35) * 0.08;
        wPts.push(new THREE.Vector3(
          trunkBaseX + Math.cos(angle) * 0.38 + swayX,
          y,
          Math.sin(angle) * 0.38 + swayZ
        ));
      }
      createSplineTube(wPts, 0.009, wireMat, trunkGroup, 36);
    }

    // Living Creeper Vine Plant
    const vinePts: THREE.Vector3[] = [];
    const vineLeaves: THREE.Mesh[] = [];

    // Organic Teardrop Leaf Shape
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.04, 0.04, 0.08, 0.12, 0, 0.25);
    leafShape.bezierCurveTo(-0.08, 0.12, -0.04, 0.04, 0, 0);
    const leafGeom = registerGeom(new THREE.ShapeGeometry(leafShape));
    leafGeom.translate(0, -0.05, 0);

    for (let step = 0; step <= 64; step++) {
      const y = -7.0 + (step / 64) * 14.0;
      const angle = y * 3.5;
      const swayX = Math.sin(y * 0.4) * 0.12;
      const swayZ = Math.cos(y * 0.35) * 0.08;
      const px = trunkBaseX + Math.cos(angle) * 0.4 + swayX;
      const pz = Math.sin(angle) * 0.4 + swayZ;
      vinePts.push(new THREE.Vector3(px, y, pz));

      if (step % 4 === 0) {
        const lMesh = new THREE.Mesh(leafGeom, emeraldFoliageMat);
        lMesh.position.set(px, y, pz).add(new THREE.Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15));
        lMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        trunkGroup.add(lMesh);
        vineLeaves.push(lMesh);
      }
    }
    createSplineTube(vinePts, 0.015, creeperMat, trunkGroup, 64);

    // 2. REALISTIC TAPERING FANTASY BRANCHES & CRADLES
    const branchGroups: THREE.Group[] = [];
    const cradleAnchors: THREE.Vector3[] = [];
    const crystalLeaves: THREE.Mesh[] = [];
    const weepingTendrils: THREE.Mesh[] = [];

    for (let i = 0; i < projectCount; i++) {
      // Orbit group allows branches to spiral around the trunk
      const orbitGroup = new THREE.Group();
      // Distribute branches spirally: e.g. 75 degrees apart
      orbitGroup.rotation.y = i * (Math.PI * -0.45);
      treeGroup.add(orbitGroup);

      const branchGroup = new THREE.Group();
      orbitGroup.add(branchGroup);
      branchGroups.push(branchGroup);

      // Main Tapering Wooden Bough growing along +X
      const boughSegA = [
        new THREE.Vector3(trunkBaseX + 0.3, -0.15, 0),
        new THREE.Vector3(1.1, 0.05, 0.05),
        new THREE.Vector3(1.8, 0.2, 0.1)
      ];
      createSplineTube(boughSegA, 0.12, barkMat, branchGroup, 24);

      const boughSegB = [
        new THREE.Vector3(1.8, 0.2, 0.1),
        new THREE.Vector3(2.6, 0.25, 0.15),
        new THREE.Vector3(3.2, 0.15, 0.08),
        new THREE.Vector3(3.8, 0.05, 0)
      ];
      createSplineTube(boughSegB, 0.07, barkMat, branchGroup, 24);

      // Upper Secondary Fork
      const upperFork = [
        new THREE.Vector3(2.4, 0.23, 0.12),
        new THREE.Vector3(3.0, 0.6, 0.08),
        new THREE.Vector3(3.6, 0.8, 0.04)
      ];
      createSplineTube(upperFork, 0.045, barkMat, branchGroup, 16);

      // Embedded Bioluminescent Sap Vein
      const mainSapVein = [
        new THREE.Vector3(trunkBaseX + 0.35, 0, 0.08),
        new THREE.Vector3(1.1, 0.15, 0.14),
        new THREE.Vector3(1.8, 0.28, 0.18),
        new THREE.Vector3(2.6, 0.32, 0.2),
        new THREE.Vector3(3.2, 0.22, 0.12)
      ];
      createSplineTube(mainSapVein, 0.02, cyanSapMat, branchGroup, 36);

      // Foliage & Fractal Twigs (Real World Detailing)
      const twigBases = [
        new THREE.Vector3(2.6, 0.25, 0.15),
        new THREE.Vector3(3.2, 0.15, 0.08),
        new THREE.Vector3(2.4, 0.23, 0.12),
        new THREE.Vector3(3.0, 0.6, 0.08),
        new THREE.Vector3(3.6, 0.8, 0.04)
      ];

      twigBases.forEach((basePt, tIdx) => {
        // Sprout 1-3 small twigs from each base
        const numTwigs = 1 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numTwigs; j++) {
          const dir = new THREE.Vector3((Math.random() - 0.5) * 1.2, Math.random() * 1.0 + 0.2, (Math.random() - 0.5) * 1.2).normalize();
          const length = 0.25 + Math.random() * 0.35;
          const endPt = basePt.clone().add(dir.multiplyScalar(length));
          const midPt = basePt.clone().lerp(endPt, 0.5).add(new THREE.Vector3(0, 0.1, 0)); // Natural upward curve

          // Render Twig
          createSplineTube([basePt, midPt, endPt], 0.012, barkMat, branchGroup, 8);

          // Canopy Leaf Cluster at twig end
          const clusterSize = 6 + Math.floor(Math.random() * 8);
          for (let k = 0; k < clusterSize; k++) {
            const lMat = Math.random() > 0.5 ? emeraldFoliageMat : cyanFoliageMat;
            const leafMesh = new THREE.Mesh(leafGeom, lMat);

            // Natural spherical canopy scatter
            const scatter = new THREE.Vector3(
              (Math.random() - 0.5) * 0.45,
              (Math.random() - 0.5) * 0.45,
              (Math.random() - 0.5) * 0.45
            );
            leafMesh.position.copy(endPt).add(scatter);

            // Align leaf to point outwards from center of cluster
            const outwardDir = scatter.clone().normalize();
            leafMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outwardDir);
            leafMesh.rotateX((Math.random() - 0.5) * 0.8); // Add organic jitter

            leafMesh.scale.setScalar(0.9 + Math.random() * 0.8);
            branchGroup.add(leafMesh);
            crystalLeaves.push(leafMesh);
          }
        }
      });

      // Weeping Tendrils
      const tendrilOrigins = [
        new THREE.Vector3(1.8, 0.1, 0.1),
        new THREE.Vector3(2.6, 0.1, 0.15),
        new THREE.Vector3(3.2, 0.05, 0.05)
      ];
      tendrilOrigins.forEach((orig, tIdx) => {
        const dropHeight = 0.6 + (tIdx % 2 === 0 ? 0.4 : 0.2);
        const tPts = [
          orig.clone(),
          orig.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.1, -dropHeight * 0.5, (Math.random() - 0.5) * 0.1)),
          orig.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.15, -dropHeight, (Math.random() - 0.5) * 0.15))
        ];
        const tMesh = createSplineTube(tPts, 0.012, weepingTendrilMat, branchGroup, 16);
        weepingTendrils.push(tMesh);
      });

      // Branch Cradle / Keystone Anchor for Card Projection
      const keystonePos = new THREE.Vector3(2.4, 0.4, 0.2);
      cradleAnchors.push(keystonePos);
    }

    // 3. Multi-Tier Ambient Stardust
    const particleCount = 200;
    const particleGeom = registerGeom(new THREE.BufferGeometry());
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 10;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = registerMat(new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    }));
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mana Core Dust near trunk
    const coreDustCount = 150;
    const coreDustGeom = registerGeom(new THREE.BufferGeometry());
    const coreDustPos = new Float32Array(coreDustCount * 3);
    for (let i = 0; i < coreDustCount * 3; i += 3) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 0.8;
      coreDustPos[i] = Math.cos(a) * r;
      coreDustPos[i + 1] = (Math.random() - 0.5) * 12;
      coreDustPos[i + 2] = Math.sin(a) * r;
    }
    coreDustGeom.setAttribute('position', new THREE.BufferAttribute(coreDustPos, 3));
    const coreDustMat = registerMat(new THREE.PointsMaterial({
      size: 0.06,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    }));
    const coreDust = new THREE.Points(coreDustGeom, coreDustMat);
    treeGroup.add(coreDust);

    const updateSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      // Adjust tree position and camera distance for responsive layout
      if (w < 480) {
        camera.position.z = 5.8;
        camera.position.x = 0.4;
        treeGroup.position.x = -1.4;
      } else if (w < 768) {
        camera.position.z = 5.0;
        camera.position.x = 0;
        treeGroup.position.x = -1.8;
      } else {
        camera.position.z = 4.8;
        camera.position.x = 0;
        treeGroup.position.x = -2.3;
      }
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    updateSize();

    // 4. FLUID TRAVERSAL ENGINE WITH SPRING BOUNDARIES
    let currentProgress = activeIndexRef.current;
    let targetProgress = activeIndexRef.current;
    let isInteracting = false;
    let isTouching = false;
    let isMouseDown = false;
    let lastScrollTime = 0;
    let targetOverscroll = 0;
    let currentOverscroll = 0;
    let overscrollVelocity = 0;

    const applyScroll = (delta: number) => {
      const minLimit = 0.2;
      const maxLimit = projectCount - 1 + 0.2;
      const maxPull = 0.40;

      // When reversing scroll direction while stretched, smoothly unwind target overscroll first
      if (targetOverscroll < 0 && delta > 0) {
        targetOverscroll += delta * 0.7;
        if (targetOverscroll > 0) {
          const leftover = targetOverscroll / 0.7;
          targetOverscroll = 0;
          targetProgress += leftover;
        }
      } else if (targetOverscroll > 0 && delta < 0) {
        targetOverscroll += delta * 0.7;
        if (targetOverscroll < 0) {
          const leftover = targetOverscroll / 0.7;
          targetOverscroll = 0;
          targetProgress += leftover;
        }
      } else {
        const newTarget = targetProgress + delta;
        if (newTarget < minLimit) {
          targetProgress = minLimit;
          const over = newTarget - minLimit;
          const currentPull = Math.abs(targetOverscroll);
          const resistance = Math.max(0.04, 1 - Math.pow(currentPull / maxPull, 1.6));
          targetOverscroll += over * resistance * 0.4;
          targetOverscroll = Math.max(-maxPull, Math.min(maxPull, targetOverscroll));
        } else if (newTarget > maxLimit) {
          targetProgress = maxLimit;
          const over = newTarget - maxLimit;
          const currentPull = Math.abs(targetOverscroll);
          const resistance = Math.max(0.04, 1 - Math.pow(currentPull / maxPull, 1.6));
          targetOverscroll += over * resistance * 0.4;
          targetOverscroll = Math.max(-maxPull, Math.min(maxPull, targetOverscroll));
        } else {
          targetProgress = newTarget;
        }
      }
    };

    stepProjectRef.current = (dir: number) => {
      const currentInt = Math.round(targetProgress);
      const next = currentInt + dir;
      if (next < 0) {
        overscrollVelocity = -0.05;
      } else if (next >= projectCount) {
        overscrollVelocity = 0.05;
      } else {
        targetProgress = next;
      }
    };

    jumpToProgressRef.current = (pct: number) => {
      targetProgress = Math.round(pct * (projectCount - 1));
      targetOverscroll = 0;
      currentOverscroll = 0;
      overscrollVelocity = 0;
    };

    // Smooth Mouse Wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      isInteracting = true;
      lastScrollTime = performance.now();
      applyScroll(e.deltaY * 0.0012);
    };

    // Touch Swipe
    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      isTouching = true;
      isInteracting = true;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      e.preventDefault();
      const dy = touchStartY - e.touches[0].clientY;
      const dx = touchStartX - e.touches[0].clientX;
      const move = Math.abs(dy) > Math.abs(dx) ? dy : -dx;
      applyScroll(move * 0.0035);
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      isTouching = false;
      isInteracting = false;
    };

    // Mouse Drag & Parallax
    let mouseStartY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      isInteracting = true;
      mouseStartY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // For parallax
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!isMouseDown) return;
      e.preventDefault();
      const dy = mouseStartY - e.clientY;
      applyScroll(dy * 0.0030);
      mouseStartY = e.clientY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s") {
        if (stepProjectRef.current) stepProjectRef.current(1);
      } else if (e.key === "ArrowUp" || e.key === "w") {
        if (stepProjectRef.current) stepProjectRef.current(-1);
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      isInteracting = false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    // 5. ANIMATION LOOP
    let time = 0;
    let animationFrameId: number;

    const render = () => {
      time += 0.015;

      // Strict hard bounds: prevent any overscrolling past the first or last card
      if (targetProgress < 0.2) {
        targetProgress = 0.2;
      } else if (targetProgress > projectCount - 1 + 0.2) {
        targetProgress = projectCount - 1 + 0.2;
      }

      const isWheelActive = performance.now() - lastScrollTime < 180;
      if (!isTouching && !isMouseDown && !isWheelActive) {
        isInteracting = false;
      }

      // Smooth spring recovery physics
      const isHolding = isMouseDown || isTouching;
      if (!isHolding) {
        targetOverscroll += (0 - targetOverscroll) * 0.08;
        if (Math.abs(targetOverscroll) < 0.0002) {
          targetOverscroll = 0;
        }
      }

      // Critically damped spring follower for smooth visual displacement
      const displacement = targetOverscroll - currentOverscroll;
      overscrollVelocity = (overscrollVelocity + displacement * 0.10) * 0.78;
      currentOverscroll += overscrollVelocity;
      if (Math.abs(currentOverscroll) < 0.0002 && Math.abs(overscrollVelocity) < 0.0002 && targetOverscroll === 0) {
        currentOverscroll = 0;
        overscrollVelocity = 0;
      }

      // Silky, smooth continuous inertia without integer snapping
      currentProgress += (targetProgress - currentProgress) * 0.052;

      // Active project calculation
      const activeIdx = Math.max(0, Math.min(projectCount - 1, Math.round(currentProgress)));
      if (activeIdx !== activeIndexRef.current) {
        setActiveIndex(activeIdx);
      }

      // Update scrubber UI thumb percentage
      const normProgress = projectCount > 1 ? currentProgress / (projectCount - 1) : 0;
      const clampedProgress = Math.max(0, Math.min(1, normProgress));
      if (scrubberThumbRef.current) {
        scrubberThumbRef.current.style.transform = `translateY(${clampedProgress * 220}px)`;
      }
      if (scrubberFillRef.current) {
        scrubberFillRef.current.style.transform = `scaleY(${clampedProgress})`;
      }

      // Parallax Camera Sway
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // 3D Tree Rotation & Traversal
      // Keep rotation locked to scroll progress, applying pure vertical displacement for overscroll
      treeGroup.rotation.y = currentProgress * (Math.PI * 0.45);
      treeGroup.position.y = currentOverscroll * 1.5;
      treeGroup.rotation.z = 0;
      treeGroup.updateMatrixWorld(true);

      const cameraPos = camera.position;

      // Position each branch and project card
      for (let i = 0; i < projectCount; i++) {
        // Linear distance from current view center (no wrap around)
        const relIdx = i - currentProgress;

        const bGroup = branchGroups[i];

        // Vertical offset so they spiral up/down
        bGroup.position.y = -relIdx * 2.8;

        const dist = Math.abs(relIdx);
        // Fade out branches that are too far vertically
        bGroup.visible = dist < 1.8;

        if (bGroup.visible && cardsRef.current[i]) {
          // Calculate Cradle World Position
          const cradleLocal = cradleAnchors[i].clone();
          const cradleWorld = bGroup.localToWorld(cradleLocal);

          // Project to 2D Screen Space
          cradleWorld.project(camera);

          // Depth and Visibility Scaling: scale down earlier & more prominently behind the trunk
          const isCompact = window.innerWidth < 500;
          let xOffset = 0;
          if (isCompact) {
            xOffset = -28;
          } else if (window.innerWidth >= 1200) {
            xOffset = 60;
          } else if (window.innerWidth >= 860) {
            xOffset = 35;
          } else if (window.innerWidth >= 768) {
            xOffset = 50;
          }

          const containerW = container.clientWidth;
          const containerH = container.clientHeight;
          const rawX = (cradleWorld.x * 0.5 + 0.5) * containerW + xOffset;
          const rawY = -(cradleWorld.y * 0.5 - 0.5) * containerH;

          const baseScale = isCompact ? 0.82 : 1.0;
          const distNorm = Math.max(0, Math.min(1, (dist - 0.20) / 0.80));
          const scale = (1.0 - distNorm * 0.40) * baseScale;
          const opacity = 1.0 - distNorm * 0.95;

          const zIndex = Math.round((1 - distNorm) * 20);

          // Boundary safe-guard: clamp X and Y so cards never clip outside the container border
          const cardWidth = window.innerWidth >= 860 ? 330 : window.innerWidth >= 768 ? 300 : 250;
          const halfCardW = (cardWidth * scale) / 2;
          const safePadding = 14;
          const x = Math.max(halfCardW + safePadding, Math.min(containerW - halfCardW - safePadding, rawX));

          const cardHeight = isCompact ? 220 : 250;
          const halfCardH = (cardHeight * scale) / 2;
          const safePaddingY = 12;
          const y = Math.max(halfCardH + safePaddingY, Math.min(containerH - halfCardH - safePaddingY, rawY));

          const cardEl = cardsRef.current[i];
          if (cardEl) {
            cardEl.style.transform = `translate3d(calc(${x.toFixed(2)}px - 50%), calc(${y.toFixed(2)}px - 50%), 0) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toString();
            cardEl.style.zIndex = zIndex.toString();
            cardEl.style.pointerEvents = distNorm < 0.25 ? 'auto' : 'none';
          }

          // Update SVG Tether Path
          const pathEl = tetherPathsRef.current[i];
          if (pathEl) {
            const kx = (cradleWorld.x * 0.5 + 0.5) * containerW;
            const ky = -(cradleWorld.y * 0.5 - 0.5) * containerH;
            // Draw a cyber-arc from keystone to card edge
            const anchorX = x - halfCardW; // Left edge of card
            const anchorY = y;
            const cx = kx + (anchorX - kx) * 0.5;
            const cy = ky + (anchorY - ky) * 0.1;
            pathEl.setAttribute('d', `M ${kx.toFixed(2)} ${ky.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${anchorX.toFixed(2)} ${anchorY.toFixed(2)}`);
            pathEl.style.opacity = (opacity * 0.55).toString();
            pathEl.style.stroke = activeIdx === i ? '#00f2fe' : '#64748b';
            pathEl.style.strokeWidth = activeIdx === i ? '2.5' : '1';
            pathEl.style.filter = activeIdx === i ? 'drop-shadow(0 0 8px rgba(0,242,254,0.8))' : 'none';
          }

        } else {
          const cardEl = cardsRef.current[i];
          if (cardEl) cardEl.style.opacity = "0";
          const pathEl = tetherPathsRef.current[i];
          if (pathEl) pathEl.style.opacity = "0";
        }

        // Scale branch itself slightly based on vertical distance
        const bScale = Math.max(0.75, 1.0 - dist * 0.15);
        bGroup.scale.set(bScale, bScale, bScale);
      }

      // Animate Leaves & Tendrils
      crystalLeaves.forEach((leaf, idx) => {
        leaf.rotation.y += 0.015;
        leaf.position.y += Math.sin(time * 3 + idx) * 0.0008;
      });

      vineLeaves.forEach((leaf, idx) => {
        leaf.scale.setScalar(1.0 + Math.sin(time * 3 + idx) * 0.15);
      });

      weepingTendrils.forEach((tendril, idx) => {
        tendril.rotation.z = Math.sin(time * 2 + idx * 0.7) * 0.05;
        tendril.rotation.x = Math.cos(time * 1.8 + idx * 0.5) * 0.04;
      });

      particles.rotation.y = time * 0.02;
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i + 1] += Math.sin(time * 2.0 + i) * 0.002;
      }
      particleGeom.attributes.position.needsUpdate = true;

      coreDust.rotation.y = -time * 0.03;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      renderer.dispose();

      disposables.textures.forEach(t => t.dispose());
      disposables.geometries.forEach(g => g.dispose());
      disposables.materials.forEach(m => m.dispose());
      scene.clear();
    };
  }, [projectCount]);

  const activeProject = projects[activeIndex];

  return (
    <div ref={containerRef} className="position-relative w-100 h-100 overflow-hidden" style={{ touchAction: "none", background: "radial-gradient(ellipse at 50% 50%, #0c1a2c 0%, #050b14 75%)" }}>
      <canvas ref={canvasRef} className="position-absolute top-0 left-0 w-100 h-100" />

      {/* Holographic Tether SVG Layer */}
      <svg className="position-absolute top-0 left-0 w-100 h-100 pe-none z-1" style={{ overflow: 'visible' }}>
        {projects.map((p, i) => (
          <path
            key={`tether-${p.id}`}
            ref={(el) => { tetherPathsRef.current[i] = el; }}
            fill="none"
            strokeDasharray="4 4"
            style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease', willChange: 'd, opacity' }}
          />
        ))}
      </svg>

      {/* Cyber HUD Telemetry */}
      <div className="position-absolute top-50 start-0 translate-middle-y ms-3 ms-md-4 pe-none z-3 d-flex flex-column align-items-center" style={{ height: '240px' }}>
        <div className="text-info font-mono opacity-75 mb-2" style={{ fontSize: '0.55rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.1em' }}>
          SEC // {String(activeIndex + 1).padStart(2, '0')}
        </div>
        <div className="position-relative" style={{ width: '2px', height: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
          <div
            ref={scrubberFillRef}
            className="position-absolute top-0 start-0 w-100 bg-info"
            style={{
              height: '100%',
              borderRadius: '2px',
              transformOrigin: 'top center',
              transform: `scaleY(0)`,
              boxShadow: '0 0 8px rgba(0, 242, 254, 0.5)'
            }}
          />
          <div
            ref={scrubberThumbRef}
            className="position-absolute top-0 start-0 w-100 bg-info pulse-cyan"
            style={{
              height: '20px',
              borderRadius: '2px',
              transform: `translateY(0px)`,
              transition: 'box-shadow 0.2s',
              boxShadow: '0 0 10px #00f2fe'
            }}
          />
        </div>
        <div className="text-info font-mono opacity-50 mt-2" style={{ fontSize: '0.45rem' }}>
          {String(projectCount).padStart(2, '0')}
        </div>
      </div>

      {/* Interactive Overlay Layer */}
      <div className="position-absolute top-0 left-0 w-100 h-100 pe-none z-2 overflow-hidden">
        <style>{`
          .nav-hint-wrapper {
            top: 50%;
            transform: translateY(-50%);
            flex-direction: column;
          }
          .nav-hint-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            margin-bottom: 1rem;
            margin-right: 0;
            font-size: 0.4rem;
          }
          
          @media (max-width: 399px) {
            .nav-hint-wrapper {
              top: 30px;
              transform: none;
              flex-direction: row;
            }
            .nav-hint-text {
              writing-mode: horizontal-tb;
              margin-bottom: 0;
              margin-right: 0.5rem;
              font-size: 0.35rem;
            }
          }

          .cyber-tree-card-wrapper {
            width: 250px;
            max-width: 280px;
          }
          @media (min-width: 768px) {
            .cyber-tree-card-wrapper {
              width: 300px;
              max-width: 320px;
            }
          }
          @media (min-width: 860px) {
            .cyber-tree-card-wrapper {
              width: 330px;
              max-width: 360px;
            }
          }
        `}</style>
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="position-absolute pe-auto cyber-tree-card-wrapper"
            style={{
              top: 0,
              left: 0,
              opacity: 0,
              transition: "opacity 0.15s ease-out",
              transformOrigin: "center center",
              willChange: "transform, opacity"
            }}
          >
            <ProjectBentoCard project={project} />
          </div>
        ))}
      </div>

      {/* Navigation Hint */}
      <div
        className="position-absolute end-0 me-2 me-md-4 pe-none z-3 opacity-50 d-flex align-items-center nav-hint-wrapper"
        style={{ animation: 'pulse 2s infinite' }}
      >
        <div
          className="font-mono text-info nav-hint-text"
          style={{ letterSpacing: '0.2em' }}
        >
          [ W / S ] OR [ SCROLL ] TO NAVIGATE
        </div>
        <i className="bi bi-chevron-down text-info pulse-cyan" style={{ fontSize: '0.8rem' }} />
      </div>
    </div>
  );
}
