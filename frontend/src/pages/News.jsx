import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function News() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-[#6b1d1d] mb-8 text-center">
        📰 News
      </h1>

      <div
        className={`max-w-4xl w-full border-2 border-purple-500 rounded-lg bg-white transition-all duration-300 overflow-hidden ${
          showMore ? "p-6" : "p-4"
        }`}
      >
        {/* Top Section (Always Visible) */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowMore(!showMore)}
        >
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Thumbnail"
              className={`rounded-lg object-cover transition-all duration-300 ${
                showMore ? "w-40 h-40" : "w-20 h-20"
              }`}
            />
            <h2
              className={`text-[#6b1d1d] font-bold transition-all duration-300 ${
                showMore ? "text-3xl" : "text-2xl"
              }`}
            >
              Main topic
            </h2>
          </div>
          <div>
            {showMore ? (
              <ChevronUp className="text-[#6b1d1d] w-8 h-8" />
            ) : (
              <ChevronDown className="text-[#6b1d1d] w-8 h-8" />
            )}
          </div>
        </div>

        {/* Expanded Description */}
        {showMore && (
          <div className="mt-6 border-t pt-6">
            <p className="text-gray-700 leading-relaxed">
              Lorem Ipsum es simplemente el texto de relleno de las imprentas y
              archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar
              de las industrias desde el año 1500. Este es el contenido adicional
              que se muestra cuando se expande la tarjeta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
