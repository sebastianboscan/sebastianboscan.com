"use client";

import { useEffect, useState } from "react";

// Columbia, SC — where the work actually happens.
const LAT = "34.0007° N";
const LON = "81.0348° W";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function HeroTelemetry() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 mb-8 text-xs uppercase tracking-widest text-gray-400 flex-wrap">
      <span className="text-blue-400/70 tabular-nums">
        {LAT} {LON}
      </span>
      <span className="hidden md:inline text-blue-500/40">{"//"}</span>
      <span className="hidden md:inline text-blue-400/70 tabular-nums">
        {/* suppressHydrationWarning: client clock differs from SSR placeholder */}
        <span suppressHydrationWarning>{time ?? "--:--:--"}</span> UTC
      </span>
    </div>
  );
}
