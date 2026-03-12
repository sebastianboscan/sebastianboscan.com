"use client";

import { HeaderBrand } from "@/components/header/HeaderBrand";
import { navItems } from "@/components/header/content";
import { HeaderNavLink } from "@/components/header/HeaderNavLink";
import { useActiveSection } from "@/components/header/useActiveSection";

export default function Header() {
  const activeSection = useActiveSection();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <HeaderBrand />
        <div className="flex gap-1 text-xs tracking-wide text-white">
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
  );
}
