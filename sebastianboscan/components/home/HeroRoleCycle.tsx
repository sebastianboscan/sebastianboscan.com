"use client";

import { useEffect, useState } from "react";
import { heroRoles } from "@/components/home/content";

// How long each role stays fully visible, and the crossfade at each end.
const HOLD_MS = 3200;
const FADE_MS = 400;

export function HeroRoleCycle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (heroRoles.length <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fade out, swap the text while it's invisible, then fade back in.
    const hold = setTimeout(() => {
      if (reduceMotion) {
        setIndex((i) => (i + 1) % heroRoles.length);
        return;
      }
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % heroRoles.length);
        setVisible(true);
      }, FADE_MS);
      return () => clearTimeout(swap);
    }, HOLD_MS);

    return () => clearTimeout(hold);
  }, [index]);

  const role = heroRoles[index];

  return (
    // Fixed height so the hero never shifts as titles of different lengths swap in.
    <div className="h-16 mb-12 flex flex-col items-center justify-center">
      <div
        className="transition-opacity duration-300 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="text-xl text-gray-300">{role.title}</p>
        <p className="text-xs text-blue-400/70 uppercase tracking-widest mt-1">{role.org}</p>
      </div>
    </div>
  );
}
