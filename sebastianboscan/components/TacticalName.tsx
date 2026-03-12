"use client";

import { useState, useEffect } from "react";

export function TacticalName() {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const fullName = "Sebastian Boscan";

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 35; // milliseconds per character

    const typeInterval = setInterval(() => {
      if (currentIndex <= fullName.length) {
        setDisplayText(fullName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsComplete(true);
        setTimeout(() => setShowCursor(false), 500);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (!isComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [isComplete]);

  return (
    <div className="relative">
      <style>
        {`
          @keyframes scan {
            0% {
              top: 0;
            }
            100% {
              top: 100%;
            }
          }
        `}
      </style>
      <h1 className="font-[var(--font-syne)] text-6xl md:text-8xl mb-6 tracking-tight relative">
        {/* Invisible full name reserves layout space so nothing below shifts */}
        <span className="invisible select-none">{fullName}</span>
        <span className="absolute inset-0">
          {displayText}
          <span
            className={`inline-block w-1 h-16 md:h-24 bg-blue-500 ml-1 ${
              showCursor ? "opacity-100" : "opacity-0"
            } transition-opacity`}
            style={{ verticalAlign: "middle" }}
          />
        </span>
      </h1>
      {/* Scanning line effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-1 ${
          isComplete ? "opacity-0" : "opacity-100"
        }`}
        style={{
          animation: "scan 2s linear infinite",
        }}
      />
    </div>
  );
}