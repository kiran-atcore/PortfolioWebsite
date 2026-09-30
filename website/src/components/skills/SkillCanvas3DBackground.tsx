"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SkillCanvas3DBackgroundProps {
  velocity?: number;
}

export default function SkillCanvas3DBackground({ velocity = 0 }: SkillCanvas3DBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(velocity);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 310;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b14, 0.0028);

    // Distant core glow
    const coreGlow = new THREE.PointLight(0x00f2fe, 2, 800);
    coreGlow.position.set(0, 0, -600);
    scene.add(coreGlow);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1500);
    camera.position.set(0, 0, 180);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 1. Cyber Wireframe Horizon Grid (Floor & Ceiling)
    const gridGroup = new THREE.Group();

    const createGridLines = (yPos: number, colorHex: number) => {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.18,
      });

      const points: THREE.Vector3[] = [];
      const spreadX = 400;
      const depthStart = -800;
      const depthEnd = 250;
      const stepX = 40;
      const stepZ = 50;

      // Longitudinal lines (Z-axis perspective lines converging to vanishing point)
      for (let x = -spreadX; x <= spreadX; x += stepX) {
        points.push(new THREE.Vector3(x, yPos, depthStart));
        points.push(new THREE.Vector3(x * 1.6, yPos, depthEnd));
      }

      // Latitudinal lines (Cross bars receding into distance)
      for (let z = depthStart; z <= depthEnd; z += stepZ) {
        const factor = 1 + ((z - depthStart) / (depthEnd - depthStart)) * 0.6;
        points.push(new THREE.Vector3(-spreadX * factor, yPos, z));
        points.push(new THREE.Vector3(spreadX * factor, yPos, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.LineSegments(geometry, lineMaterial);
    };

    const floorGrid = createGridLines(-110, 0x00f2fe);
    const ceilingGrid = createGridLines(110, 0x7928ca);
    gridGroup.add(floorGrid);
    gridGroup.add(ceilingGrid);
    scene.add(gridGroup);

    // 2. Warp Speed Neon Starfield & Particles
    const particleCount = 350;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const purpleColor = new THREE.Color(0x9d4edd);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 600;
      positions[i3 + 1] = (Math.random() - 0.5) * 260;
      positions[i3 + 2] = -800 + Math.random() * 950;

      const c = Math.random() > 0.4 ? cyanColor : purpleColor;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 3. Floating Geometric Shapes (Wireframe Octahedrons)
    const shapesGroup = new THREE.Group();
    const shapeGeo = new THREE.OctahedronGeometry(6, 0);
    const shapeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.3 });
    
    const shapesData: { mesh: THREE.Mesh; rotSpeed: number; zSpeed: number }[] = [];
    for (let j = 0; j < 8; j++) {
      const mesh = new THREE.Mesh(shapeGeo, shapeMat);
      mesh.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 150, -800 + Math.random() * 600);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      
      const rotSpeed = (Math.random() - 0.5) * 0.05;
      const zSpeed = 0.4 + Math.random() * 0.8;
      
      shapesGroup.add(mesh);
      shapesData.push({ mesh, rotSpeed, zSpeed });
    }
    scene.add(shapesGroup);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let baseSpeed = 0.9;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Speed increases with scroll velocity
      const currentSpeed = baseSpeed + Math.abs(velocityRef.current) * 3.5;
      const posArray = particleGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3 + 2;
        posArray[i3] += currentSpeed;

        if (posArray[i3] > 190) {
          posArray[i3] = -800;
          posArray[i * 3] = (Math.random() - 0.5) * 600;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 260;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Animate Shapes
      shapesData.forEach(data => {
        data.mesh.rotation.x += data.rotSpeed;
        data.mesh.rotation.y += data.rotSpeed;
        data.mesh.position.z += data.zSpeed + currentSpeed * 0.5;
        if (data.mesh.position.z > 200) {
          data.mesh.position.z = -800;
          data.mesh.position.x = (Math.random() - 0.5) * 300;
          data.mesh.position.y = (Math.random() - 0.5) * 150;
        }
      });

      // Subtle tilt from velocity
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -velocityRef.current * 0.04, 0.08);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      shapeGeo.dispose();
      shapeMat.dispose();
      (floorGrid.geometry as THREE.BufferGeometry).dispose();
      (floorGrid.material as THREE.Material).dispose();
      (ceilingGrid.geometry as THREE.BufferGeometry).dispose();
      (ceilingGrid.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none"
      style={{
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
