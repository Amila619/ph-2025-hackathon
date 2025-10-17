import React from 'react';
import CountUp from 'react-countup';
import { FiShoppingCart, FiRefreshCcw, FiStar } from 'react-icons/fi';

const stats = [
  { id: 1, value: 10000, label: 'Sellers', icon: FiShoppingCart },
  { id: 2, value: 25000, label: 'Transactions', icon: FiRefreshCcw },
  { id: 3, value: 5000, label: 'Premium Users', icon: FiStar },
];

const StatsSection = () => {
  return (
    <div className="flex justify-center items-center py-16 px-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col justify-between bg-gray-50/90 p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Value and Icon */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-5xl font-extrabold text-gray-900">
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix="+"
                  />
                </p>
                <div className="p-3 rounded-xl bg-gray-100">
                  <stat.icon className="h-8 w-8 text-[#8A1717]" />
                </div>
              </div>

              {/* Label */}
              <p className="text-lg font-medium text-gray-500 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
