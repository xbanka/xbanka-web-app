"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
};

// Brand teals, plus warm accents so the burst reads against a dark background.
const COLORS = ["#0c9a8e", "#2dd4bf", "#5eead4", "#fbbf24", "#fb7185", "#ffffff"];

/**
 * A one-shot confetti burst, drawn on a canvas.
 *
 * Written in-house rather than pulling in a confetti package: it is a small
 * amount of code, avoids adding a dependency to the build, and lets the effect
 * use the brand palette directly.
 *
 * Fires once on mount, cleans up its animation frame, and renders nothing at
 * all when the user prefers reduced motion.
 */
export function Confetti({
  pieces = 160,
  durationMs = 4500,
}: {
  pieces?: number;
  durationMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Two launch points, angled inward, so the burst frames the card.
    const origins = [
      { x: width * 0.2, y: height * 0.35, dir: 1 },
      { x: width * 0.8, y: height * 0.35, dir: -1 },
    ];

    const particles: Particle[] = Array.from({ length: pieces }, (_, i) => {
      const origin = origins[i % origins.length];
      const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
      const speed = 6 + Math.random() * 9;

      return {
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed * origin.dir + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - 6 - Math.random() * 5,
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      };
    });

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.vy += 0.22; // gravity
        p.vx *= 0.99; // drag
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        // Hold full opacity for the first half, then fade out.
        p.life = Math.max(0, 1 - Math.max(0, elapsed / durationMs - 0.5) * 2);

        if (p.life <= 0 || p.y > height + 40) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (elapsed < durationMs) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pieces, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
