import React, { useState } from 'react';
import { Search, Briefcase, Package, Factory } from 'lucide-react';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'services', label: 'Find Services', icon: Briefcase },
    { id: 'products', label: 'Browse Products', icon: Package },
    { id: 'materials', label: 'Raw Materials', icon: Factory }
  ];

  return (
    <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Your Gateway to <span className="text-red-800">Business Growth</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Connect with service providers, find quality products, and source raw materials all in one platform
          </p>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-center gap-4 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id ? 'bg-red-800 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'services' ? 'Search for services...' :
                    activeTab === 'products' ? 'Search for products...' :
                    'Search for raw materials...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-transparent focus:border-red-800 focus:outline-none transition-colors"
                />
              </div>
              <button className="bg-red-800 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
                Search
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">50K+</div>
              <div className="text-gray-600 mt-1">Active Services</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">10K+</div>
              <div className="text-gray-600 mt-1">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">5K+</div>
              <div className="text-gray-600 mt-1">Raw Materials</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">100K+</div>
              <div className="text-gray-600 mt-1">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
