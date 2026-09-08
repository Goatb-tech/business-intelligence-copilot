"use client";

import React, { useEffect, useRef } from "react";
import { Radar, Sparkles } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import * as THREE from "three";

import { JellyTryNowButton } from "./jelly-try-now-button";

type WovenLightHeroProps = {
  brand: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

export const WovenLightHero = ({
  brand,
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}: WovenLightHeroProps) => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    textControls.start((index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05 + 0.95,
        duration: 0.9,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }));

    buttonControls.start({
      opacity: 1,
      y: 0,
      transition: { delay: 1.65, duration: 0.7 },
    });

    return () => {
      document.head.removeChild(link);
    };
  }, [buttonControls, textControls]);

  const words = title.split(" ");

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 py-8 text-white">
      <WovenCanvas />
      <HeroNav brand={brand} onPrimaryClick={onPrimaryClick} primaryLabel={primaryLabel} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,35,60,0.12),transparent_20%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.74))]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-red-300" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-red-100/90">Business Intelligence Copilot</span>
        </motion.div>

        <h1
          className="max-w-5xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 50px rgba(255, 255, 255, 0.14)" }}
        >
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block">
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={`${wordIndex}-${charIndex}`}
                  custom={wordIndex * 7 + charIndex}
                  initial={{ opacity: 0, y: 42 }}
                  animate={textControls}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < words.length - 1 ? <span>&nbsp;</span> : null}
            </span>
          ))}
        </h1>

        <motion.p
          custom={title.length}
          initial={{ opacity: 0, y: 24 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={buttonControls} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <JellyTryNowButton label={primaryLabel} onClick={onPrimaryClick} />

          {secondaryLabel ? (
            <button className="button-ghost inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold" onClick={onSecondaryClick} type="button">
              <Radar className="h-4 w-4" />
              {secondaryLabel}
            </button>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

const HeroNav = ({ brand, primaryLabel, onPrimaryClick }: { brand: string; primaryLabel: string; onPrimaryClick?: () => void }) => {
  return (
    <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }} className="absolute left-0 right-0 top-0 z-20 p-5 sm:p-6">
      <div className="panel-noir mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-sm font-bold text-red-300">
            BI
          </div>
          <div>
            <span className="font-display text-base font-semibold text-white">{brand}</span>
            <p className="text-xs text-slate-500">Local-first lead intelligence</p>
          </div>
        </div>

        <button className="button-ghost hidden rounded-full px-5 py-2.5 text-sm font-medium sm:inline-flex" onClick={onPrimaryClick} type="button">
          {primaryLabel}
        </button>
      </div>
    </motion.nav>
  );
};

const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const particleCount = 16000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const geometry = new THREE.BufferGeometry();
    const sourceGeometry = new THREE.TorusKnotGeometry(1.45, 0.46, 320, 32);
    const sourcePositions = sourceGeometry.attributes.position;

    for (let index = 0; index < particleCount; index += 1) {
      const sourceIndex = index % sourcePositions.count;
      const ix = index * 3;
      const jitter = (Math.random() - 0.5) * 0.08;
      const angle = Math.random() * Math.PI * 2;
      const baseX = sourcePositions.getX(sourceIndex);
      const baseY = sourcePositions.getY(sourceIndex);
      const baseZ = sourcePositions.getZ(sourceIndex);

      positions[ix] = baseX + Math.cos(angle) * jitter;
      positions[ix + 1] = baseY + Math.sin(angle) * jitter;
      positions[ix + 2] = baseZ + (Math.random() - 0.5) * 0.06;

      originalPositions[ix] = positions[ix];
      originalPositions[ix + 1] = positions[ix + 1];
      originalPositions[ix + 2] = positions[ix + 2];

      const color = new THREE.Color();
      color.setHSL(0.98 - Math.random() * 0.08, 0.78, 0.58 + Math.random() * 0.14);

      colors[ix] = color.r;
      colors[ix + 1] = color.g;
      colors[ix + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.017,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    function handleMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    let animationFrame = 0;

    function animate() {
      animationFrame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const threshold = 1.45;
      const thresholdSq = threshold * threshold;
      const mouseX = mouse.x * 2.3;
      const mouseY = mouse.y * 1.8;

      for (let index = 0; index < particleCount; index += 1) {
        const ix = index * 3;
        const dx = positions[ix] - mouseX;
        const dy = positions[ix + 1] - mouseY;
        const dz = positions[ix + 2];
        const distanceSq = dx * dx + dy * dy + dz * dz;

        if (distanceSq < thresholdSq) {
          const distance = Math.sqrt(distanceSq + 0.0001);
          const force = (threshold - distance) * 0.0045;
          velocities[ix] += (dx / distance) * force;
          velocities[ix + 1] += (dy / distance) * force;
          velocities[ix + 2] += (dz / distance) * force;
        }

        velocities[ix] += (originalPositions[ix] - positions[ix]) * 0.012;
        velocities[ix + 1] += (originalPositions[ix + 1] - positions[ix + 1]) * 0.012;
        velocities[ix + 2] += (originalPositions[ix + 2] - positions[ix + 2]) * 0.012;

        velocities[ix] *= 0.92;
        velocities[ix + 1] *= 0.92;
        velocities[ix + 2] *= 0.92;

        positions[ix] += velocities[ix];
        positions[ix + 1] += velocities[ix + 1] + Math.sin(elapsed * 0.7 + index * 0.003) * 0.00035;
        positions[ix + 2] += velocities[ix + 2];
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.08;
      points.rotation.x = Math.sin(elapsed * 0.22) * 0.1;
      renderer.render(scene, camera);
    }

    animate();
    window.addEventListener("mousemove", handleMouseMove);

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      sourceGeometry.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};
