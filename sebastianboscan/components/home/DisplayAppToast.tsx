"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "display-app-toast-dismissed";

export function DisplayAppToast() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    const timer = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setMounted(false), 300);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-[80] w-[320px] max-w-[calc(100vw-2.5rem)] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      role="dialog"
      aria-label="Meta Ray-Ban Display app available"
    >
      <div className="relative border border-blue-500/40 bg-[#0a0a0a]/95 backdrop-blur-sm p-5 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/60 pointer-events-none" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-blue-400 font-mono uppercase tracking-[0.3em]">
            New // Wearable
          </span>
        </div>

        <p className="text-[#f0f0f0] text-sm font-medium mb-1">
          Meta Ray-Ban Display App
        </p>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          I built a HUD version of this site for Meta Ray-Ban Display glasses. View it on the
          glasses or preview it in your browser.
        </p>

        <a
          href="/display-app"
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-blue-300 border border-blue-500/50 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-200 transition-all"
        >
          Open Display App
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
