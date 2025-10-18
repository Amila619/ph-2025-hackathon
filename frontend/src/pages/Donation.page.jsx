import React from "react";

function Donation() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-red-100 to-red-200 justify-center items-center px-6 md:px-24 py-16">
      
      <div className="flex flex-col md:flex-row bg-white rounded-4xl shadow-2xl overflow-hidden w-full max-w-6xl">
        
        {/* Left Side Text */}
        <div className="flex flex-col justify-center items-start bg-red-800 md:w-1/2 p-12 md:p-24 text-white space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold">
            Together
          </h1>
          <p className="text-xl md:text-3xl italic">
            We build,<br />We Help
          </p>
        </div>

        {/* Right Side Form */}
        <div className="bg-red-50 md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="bg-red-800 text-white text-center py-4 rounded-t-2xl mb-6">
            <h2 className="text-2xl font-semibold">Support Them</h2>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Enter Your Details</h3>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <button className="w-full bg-red-800 text-white py-3 text-lg rounded-2xl hover:bg-red-700 transition-shadow shadow-md">
              Donate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Donation;
