import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function News() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // 🗞️ Your news data
  const newsData = [
    {
      id: 1,
      title: "New ICT Building Opening Ceremony",
      image: "https://via.placeholder.com/150",
      description:
        "The Faculty of Technology announced the grand opening of the new ICT building. The event will include guest speeches, cultural events, and a campus tour.",
    },
    {
      id: 2,
      title: "Hackathon 2025 Winners Announced",
      image: "https://via.placeholder.com/150",
      description:
        "After two days of intense coding, Team InnovateX was declared the winner of the Hackathon 2025. Their project on AI-powered accessibility impressed the judges.",
    },
    {
      id: 3,
      title: "University Sports Meet 2025 Highlights",
      image: "https://via.placeholder.com/150",
      description:
        "The annual sports meet concluded successfully with record-breaking performances. The Faculty of Science won the overall championship this year.",
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-[#6b1d1d] mb-10 text-center">
        📰 Latest News
      </h1>

      <div className="space-y-6 max-w-4xl w-full">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className={`border-2 border-purple-500 rounded-lg bg-white transition-all duration-300 overflow-hidden ${
              expandedIndex === index ? "p-6" : "p-4"
            }`}
          >
            {/* Top Section (Always Visible) */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={news.image}
                  alt={news.title}
                  className={`rounded-lg object-cover transition-all duration-300 ${
                    expandedIndex === index ? "w-40 h-40" : "w-20 h-20"
                  }`}
                />
                <h2
                  className={`text-[#6b1d1d] font-bold transition-all duration-300 ${
                    expandedIndex === index ? "text-3xl" : "text-2xl"
                  }`}
                >
                  {news.title}
                </h2>
              </div>
              <div>
                {expandedIndex === index ? (
                  <ChevronUp className="text-[#6b1d1d] w-8 h-8" />
                ) : (
                  <ChevronDown className="text-[#6b1d1d] w-8 h-8" />
                )}
              </div>
            </div>

            {/* Expanded Description */}
            {expandedIndex === index && (
              <div className="mt-6 border-t pt-6">
                <p className="text-gray-700 leading-relaxed">
                  {news.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
