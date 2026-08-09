"use client";

import { useEffect, useRef } from "react";

const CELL = 48;
// How far from the cursor the warp still has any effect.
const RADIUS = 260;
// Peak pixel displacement at the cursor itself. Near a full cell, so the
// warp reads as a bulge rather than a subtle bend.
const STRENGTH = 40;
// Fraction of the remaining distance the warp closes each frame.
const EASE = 0.12;

/**
 * Pulls a grid vertex toward the cursor, falling off smoothly to zero at RADIUS.
 * The falloff is cosine-shaped so the warp has no hard edge where it ends.
 */
function displace(dx: number, dy: number) {
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist > RADIUS) return { x: 0, y: 0 };

  const falloff = (Math.cos((dist / RADIUS) * Math.PI) + 1) / 2;
  const amount = (STRENGTH * falloff) / dist;
  return { x: dx * amount, y: dy * amount };
}

export function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Target follows the pointer; current lags behind it for a springy feel.
    const target = { x: -9999, y: -9999 };
    const current = { x: -9999, y: -9999 };
    let frame = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.14)";
      ctx.lineWidth = 1;

      // One extra cell past each edge so warped lines never pull away from the border.
      const cols = Math.ceil(w / CELL) + 2;
      const rows = Math.ceil(h / CELL) + 2;

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          const x = i * CELL;
          const y = j * CELL;
          const d = displace(x - current.x, y - current.y);
          if (j === 0) ctx.moveTo(x + d.x, y + d.y);
          else ctx.lineTo(x + d.x, y + d.y);
        }
        ctx.stroke();
      }

      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          const x = i * CELL;
          const y = j * CELL;
          const d = displace(x - current.x, y - current.y);
          if (i === 0) ctx.moveTo(x + d.x, y + d.y);
          else ctx.lineTo(x + d.x, y + d.y);
        }
        ctx.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onPointerLeave = () => {
      target.x = -9999;
      target.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Static grid only — no pointer tracking, no animation loop.
      draw();
      cancelAnimationFrame(frame);
    } else {
      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerleave", onPointerLeave);
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
