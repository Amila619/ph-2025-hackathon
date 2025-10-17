import React, { useState } from 'react';
import { Briefcase, Package, Factory } from 'lucide-react';

const MarketplaceTabs = () => {
  const [activeSection, setActiveSection] = useState('services');

  const serviceCategories = [
    { name: 'Web Development', icon: '💻', count: '12,450', color: 'from-blue-500 to-blue-600' },
    { name: 'Graphic Design', icon: '🎨', count: '15,670', color: 'from-pink-500 to-pink-600' },
    { name: 'Writing & Content', icon: '✍️', count: '9,840', color: 'from-green-500 to-green-600' },
    { name: 'Digital Marketing', icon: '📊', count: '11,230', color: 'from-orange-500 to-orange-600' },
    { name: 'Translation', icon: '🌐', count: '7,650', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Legal Services', icon: '⚖️', count: '5,420', color: 'from-purple-500 to-purple-600' }
  ];

  const productCategories = [
    { name: 'Electronics', icon: '🔌', count: '3,200', color: 'from-blue-500 to-blue-600' },
    { name: 'Machinery', icon: '⚙️', count: '2,800', color: 'from-gray-500 to-gray-600' },
    { name: 'Furniture', icon: '🪑', count: '1,900', color: 'from-amber-500 to-amber-600' },
    { name: 'Textiles', icon: '🧵', count: '2,400', color: 'from-pink-500 to-pink-600' },
    { name: 'Food Products', icon: '🍽️', count: '1,600', color: 'from-green-500 to-green-600' },
    { name: 'Packaging', icon: '📦', count: '1,100', color: 'from-orange-500 to-orange-600' }
  ];

  const materialCategories = [
    { name: 'Metals & Alloys', icon: '🔩', count: '1,800', color: 'from-slate-500 to-slate-600' },
    { name: 'Chemicals', icon: '🧪', count: '1,200', color: 'from-purple-500 to-purple-600' },
    { name: 'Plastics & Polymers', icon: '🛢️', count: '950', color: 'from-blue-500 to-blue-600' },
    { name: 'Wood & Lumber', icon: '🪵', count: '680', color: 'from-amber-500 to-amber-600' },
    { name: 'Textiles & Fabrics', icon: '🧶', count: '840', color: 'from-pink-500 to-pink-600' },
    { name: 'Agricultural', icon: '🌾', count: '720', color: 'from-green-500 to-green-600' }
  ];

  const sections = [
    { id: 'services', label: 'Services', icon: Briefcase, categories: serviceCategories },
    { id: 'products', label: 'Products', icon: Package, categories: productCategories },
    { id: 'materials', label: 'Raw Materials', icon: Factory, categories: materialCategories }
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Marketplace</h2>
          <p className="text-xl text-gray-600">Everything your business needs in one place</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeSection === section.id
                    ? 'bg-red-800 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                {section.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSection.categories.map((cat, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}>
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count} listings</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceTabs;
