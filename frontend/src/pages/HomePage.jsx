import React from "react";

export default function HomePage() {
  const handleClick = () => {
    window.location.href = "/explore";
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="assets/videos/sample.mp4" 
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/35 to-black/55 z-10"></div>

      {/* Centered Text */}
      <div className="relative z-20 text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
        Prosperous Nation, Brighter Tomorrow
        </h1>
        <p className="text-lg mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        Building a smarter way for the nation to collaborate, where ideas, talent, and resources come together to create real impact.
        </p>
        <button
          onClick={handleClick}
          className="px-6 py-2 rounded-lg bg-white/15 text-white text-base cursor-pointer shadow-lg backdrop-blur-sm transition duration-200 ease-in-out hover:bg-white/25"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
}
