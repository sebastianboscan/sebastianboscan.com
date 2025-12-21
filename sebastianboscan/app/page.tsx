import Image from "next/image";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
      <div className="text-center">
        <h1>Hello!</h1>
        <p>This is Sebastian</p>
        {/* <Image src="/images/headshot.jpg" width="200" height="200" alt="Headshot of Sebastian"/> */}
      </div>
    </div>
  );
}
