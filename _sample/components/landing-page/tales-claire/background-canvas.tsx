"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

/**
 *
 */
export function BackgroundCanvas() {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const isSystemDark = globalThis.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = theme === "dark" || (theme === "system" && isSystemDark);

    // Colors based on theme
    const particleColor = isDark ? "255, 255, 255" : "20, 20, 20";
    const nebulaStart = isDark
      ? "rgba(20, 30, 60, 0.4)"
      : "rgba(200, 210, 255, 0.4)";
    const nebulaEnd = isDark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)";

    let particles: Particle[] = [];

    const resize = () => {
      // 親要素が fixed w-full h-full なので window サイズでOK
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((width * height) / 15_000);
      for (let index = 0; index < particleCount; index++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);

      // Draw subtle nebula effect
      const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width
      );
      gradient.addColorStop(0, nebulaStart);
      gradient.addColorStop(1, nebulaEnd);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.update(width, height);
        p.draw(context, particleColor);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <canvas
      ref={canvasReference}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-500"
    />
  );
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 2;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(${color}, ${this.opacity})`;
    context.fill();
  }
}
