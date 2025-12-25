import Image from "next/image";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="p-6">
        <nav className="max-w-7xl mx-auto">
          <h2>Sebastian</h2>
        </nav>
      </header>
      
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center">
          <h1>Hello!</h1>
          <p>This is Sebastian</p>
        </div>
      </div>
    </div>
  );
}