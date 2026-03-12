import { TacticalName } from "@/components/TacticalName";
import { heroLinks } from "@/components/home/content";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 pt-[57px] overflow-hidden">
      <div className="absolute top-[57px] left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute top-[57px] right-0 w-32 h-32 border-t-2 border-r-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-blue-500/30 pointer-events-none" />

      <div className="text-center max-w-4xl px-6 w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400 tracking-widest uppercase">All Systems Nominal</span>
        </div>

        <TacticalName />

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />
        <p className="text-xl text-gray-300 mb-12">Computer Science Student</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all hover:shadow-lg hover:shadow-blue-500/20 block"
            >
              <div className="text-xs text-gray-400 uppercase tracking-wider">{link.label}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
