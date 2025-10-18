import React from "react";

function Donation() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f4f5] justify-between items-center px-8 md:px-24">
        <div className="flex flex-col md:flex-row h-screen bg-white justify-between items-center px-8 md:px-24 rounded-4xl shadow-lg space-x-12">
            {/* Left Side Text */}
            <div className="flex flex-row items-center space-x-6 mb-10 md:mb-0">
                <h1 className="text-6xl md:text-8xl font-bold text-[#6b1d1d]">
                Together
                </h1>
                <p className="text-lg md:text-3xl italic text-[#6b1d1d]">
                We build,<br />We Help
                </p>
            </div>

            {/* Right Side Form */}
            <div className="bg-[#f6f6f6] w-full max-w-sm rounded-2xl shadow-lg">
                {/* Header */}
                <div className="bg-[#6b1d1d] text-white text-center py-4 rounded-t-2xl">
                <h2 className="text-2xl font-semibold">Support them</h2>
                </div>

                {/* Body */}
                <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Enter details</h3>
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 mb-4 border border-[#b77d7d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b1d1d]"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 mb-4 border border-[#b77d7d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b1d1d]"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    className="w-full p-3 mb-4 border border-[#b77d7d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b1d1d]"
                />
                <button className="w-3/4 bg-[#6b1d1d] text-white py-3 text-lg rounded-2xl hover:bg-[#4d1212] transition block mx-auto">
                    Donate
                </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Donation;
