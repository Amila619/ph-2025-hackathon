import React from "react";
import SignUpintro from "./signUpintro.jsx";

export default function HomePage() {
  const handleClick = () => {
    window.location.href = "/explore";
  };

  return (
    <>
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
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>



      {/* Centered Text */}
      <div className="relative z-20 text-center text-white p-8">
        <h1 className="text-7xl md:text-8xl font-bold mb-4 drop-shadow-[0_6px_18px_rgba(255,255,255,0.6)]">
        <span className="text-[#fc1414]">Prosperous</span> Nation
        </h1>
        <h1 className="text-5xl font-bold font-bold mb-4 drop-shadow-[0_6px_18px_rgba(255,255,255,0.6)]">
        <span className="text-[#fc1414]">Brighter</span> Tomorrow
        </h1>
        <p className="text-lg mb-6 py-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        Building a smarter way for the nation to collaborate, where ideas, talent, and resources come together to create real impact.
        </p>

        <br />
        
        
        <button
  onClick={handleClick}
  className="px-8 py-4 rounded-xl bg-[#8A1717] text-white text-lg font-semibold cursor-pointer shadow-lg backdrop-blur-sm transition duration-200 ease-in-out hover:bg-[#8A1717]/25"
>
  Explore Now
</button>



      </div>
      
    </div>

    <SignUpintro />

    </>

    
  );
}
