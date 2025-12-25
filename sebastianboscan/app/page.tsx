import Image from "next/image";
import { TacticalName } from "../components/TacticalName";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden" style={{ cursor: 'crosshair' }}>
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Corner Accent Lines */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-blue-500/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-500/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-blue-500/30" />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 animate-pulse" />
            <h2 className="tracking-wider uppercase text-sm">
              Sebastian
            </h2>
          </div>
          <div className="flex gap-8 text-sm tracking-wide">
            <a
              href="#about"
              className="hover:text-blue-400 hover:bg-blue-500/10 px-3 py-1 transition-all border border-transparent hover:border-blue-500/30"
              style={{ cursor: 'pointer' }}
            >
              About
            </a>
            <a
              href="#work"
              className="hover:text-blue-400 hover:bg-blue-500/10 px-3 py-1 transition-all border border-transparent hover:border-blue-500/30"
              style={{ cursor: 'pointer' }}
            >
              Work
            </a>
            <a
              href="#contact"
              className="hover:text-blue-400 hover:bg-blue-500/10 px-3 py-1 transition-all border border-transparent hover:border-blue-500/30"
              style={{ cursor: 'pointer' }}
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="text-center max-w-4xl px-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 tracking-widest uppercase">
              All Systems Nominal
            </span>
          </div>

          <TacticalName />

          {/* Accent Line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />

          <p className="text-xl text-gray-300 mb-12">
            Software Engineer
          </p>

          {/* Tech Stats/Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Education
              </div>
            </div>
            <div className="border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Experience
              </div>
            </div>
            <div className="border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Projects
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between text-xs text-gray-500">
          <div>v1.0.0</div>
          <div className="flex gap-6">
            <span>LAT: 33.9949° N</span>
            <span>LONG: 81.0285° W</span>
            <span>
              UTC:{" "}
              {
                new Date()
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}