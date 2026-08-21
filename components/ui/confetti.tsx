"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  wobble: number;
  wobbleSpeed: number;
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
 * The canvas is rendered through a portal onto `document.body`. Most success
 * screens live inside a modal, and the modal card animates in with a transform
 * — a transformed ancestor turns `position: fixed` into `position: absolute`,
 * which would clip the burst to the card (and hide it entirely behind the
 * card's `overflow-y-auto` on mobile). Portalling keeps it viewport-wide.
 *
 * Motion is integrated against elapsed time rather than frame count, so the
 * burst falls at the same speed on a 60Hz and a 120Hz display.
 *
 * Fires once on mount, cleans up its animation frame, and renders nothing at
 * all when the user prefers reduced motion.
 */
export function Confetti({
  pieces = 160,
  durationMs = 6000,
}: {
  pieces?: number;
  durationMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Built during render rather than in an effect so the canvas is already
  // attached to the portal host on the first paint; the host itself joins the
  // document in the effect below. Null on the server, where there is no DOM.
  const [host] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );

  useEffect(() => {
    if (!host) return;
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  useEffect(() => {
    if (!host) return;

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
      { x: width * 0.18, y: height * 0.42, dir: 1 },
      { x: width * 0.82, y: height * 0.42, dir: -1 },
    ];

    const particles: Particle[] = Array.from({ length: pieces }, (_, i) => {
      const origin = origins[i % origins.length];
      const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
      const speed = 2.6 + Math.random() * 4.2;

      return {
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed * origin.dir + (Math.random() - 0.5) * 1.2,
        vy: Math.sin(angle) * speed - 2.6 - Math.random() * 2.2,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.12,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      };
    });

    // Tuned so the pieces hang in the air long enough to be seen: a soft
    // launch, light gravity and heavy drag give a slow drift rather than a
    // snap. `step` is one 60Hz frame's worth of motion.
    const GRAVITY = 0.075;
    const DRAG = 0.985;

    let frame = 0;
    const start = performance.now();
    let previous = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      // Normalise to 60Hz frames, and clamp so a backgrounded tab does not
      // teleport every piece off-screen when it resumes.
      const step = Math.min((now - previous) / (1000 / 60), 3);
      previous = now;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.vy += GRAVITY * step;
        p.vx *= Math.pow(DRAG, step);
        p.vy *= Math.pow(DRAG, step);
        p.wobble += p.wobbleSpeed * step;
        // A little sideways flutter, the way real paper falls.
        p.x += (p.vx + Math.sin(p.wobble) * 0.35) * step;
        p.y += p.vy * step;
        p.rotation += p.spin * step;
        // Hold full opacity for the first two thirds, then fade out.
        p.life = Math.max(
          0,
          1 - Math.max(0, elapsed / durationMs - 0.66) * (1 / 0.34),
        );

        if (p.life <= 0 || p.y > height + 40) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Scaling the height by the wobble fakes the piece turning edge-on.
        ctx.scale(1, Math.abs(Math.cos(p.wobble)) * 0.7 + 0.3);
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
  }, [host, pieces, durationMs]);

  if (!host) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Above the modal layer (z-50) so the burst is never painted behind a card.
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
    />,
    host,
  );
}
