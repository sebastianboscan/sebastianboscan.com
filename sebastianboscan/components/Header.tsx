"use client";

import { useState, useCallback } from "react";
import { HeaderBrand } from "@/components/header/HeaderBrand";
import { navItems } from "@/components/header/content";
import { HeaderNavLink } from "@/components/header/HeaderNavLink";
import { useActiveSection } from "@/components/header/useActiveSection";

export default function Header() {
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* Mobile hamburger — sits above everything */}
      <button
        type="button"
        className="md:hidden fixed top-4 right-5 z-[70] flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
        <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
      </button>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <HeaderBrand />

          {/* Desktop nav */}
          <div className="hidden md:flex gap-1 text-xs tracking-wide text-white">
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
              />
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile slide-in menu */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-300 ${
          menuOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setMenuOpen(false); }}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-56 flex flex-col gap-1 pt-16 px-4 transition-transform duration-300 border-l border-gray-800/50 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "#000" }}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick}
              className={`text-xs font-mono uppercase tracking-widest px-3 py-2 transition-all border ${
                activeSection === item.id
                  ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
                  : "border-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
