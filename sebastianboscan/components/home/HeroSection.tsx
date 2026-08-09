import { TacticalName } from "@/components/TacticalName";
import { HeroTelemetry } from "@/components/home/HeroTelemetry";
import { heroLinks } from "@/components/home/content";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 pt-[57px] overflow-hidden">
      {/* Corner reticle brackets with HUD labels */}
      <div className="absolute top-[57px] left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/30 pointer-events-none">
        <span className="absolute top-2 left-2 text-[10px] text-blue-500/50 tracking-widest">SYS.01</span>
      </div>
      <div className="absolute top-[57px] right-0 w-32 h-32 border-t-2 border-r-2 border-blue-500/30 pointer-events-none">
        <span className="absolute top-2 right-2 text-[10px] text-blue-500/50 tracking-widest">REC</span>
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-500/30 pointer-events-none">
        <span className="absolute bottom-2 left-2 text-[10px] text-blue-500/50 tracking-widest">SCAN</span>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-blue-500/30 pointer-events-none">
        <span className="absolute bottom-2 right-2 text-[10px] text-blue-500/50 tracking-widest">LOCK</span>
      </div>

      <div className="text-center max-w-4xl px-6 w-full">
        <HeroTelemetry />

        <TacticalName />

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />
        <p className="text-xl text-gray-300 mb-12">Computer Science Student</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative overflow-hidden border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all hover:shadow-lg hover:shadow-blue-500/20 block"
            >
              {/* Sweep that scans across the card on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none" />

              <div className="relative flex items-center justify-center gap-2">
                <span className="text-[10px] text-blue-500/60 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors uppercase tracking-wider">
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
