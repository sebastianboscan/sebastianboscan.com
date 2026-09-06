import { TacticalName } from "@/components/TacticalName";
import { HeroRoleCycle } from "@/components/home/HeroRoleCycle";
import { heroLinks } from "@/components/home/content";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 pt-[57px] overflow-hidden">
      <div className="text-center max-w-4xl px-6 w-full">
        <TacticalName />

        <div className="mt-6">
          <HeroRoleCycle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative overflow-hidden border border-white/20 bg-transparent p-6 hover:border-white/50 hover:bg-white/5 transition-all block"
            >
              {/* Sweep that scans across the card on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              <div className="relative flex items-center justify-center">
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors uppercase tracking-wider">
                  {link.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
