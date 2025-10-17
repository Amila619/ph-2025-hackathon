import React, { useState } from 'react';
import { Briefcase, Star, MapPin } from 'lucide-react';

const FeaturedListings = () => {
  const [activeType, setActiveType] = useState('services');

  const listings = {
    services: [
      { title: 'Full Stack Developer', provider: 'Tech Solutions Ltd', price: '$500-$1000', rating: 4.8, location: 'Remote', badge: 'Top Rated', type: 'Service' },
      { title: 'Logo Design Package', provider: 'Creative Studio', price: '$100-$300', rating: 4.9, location: 'Colombo', badge: 'Featured', type: 'Service' }
    ],
    products: [
      { title: 'Industrial LED Lighting (Bulk)', provider: 'Lanka Electronics', price: '$2,500/100 units', rating: 4.7, location: 'Colombo', badge: 'Verified', type: 'Product' },
      { title: 'Office Furniture Set', provider: 'Modern Furniture Co', price: '$5,000/set', rating: 4.6, location: 'Kandy', badge: 'Popular', type: 'Product' }
    ],
    materials: [
      { title: 'Steel Sheets (Grade 304)', provider: 'Steel Industries Ltd', price: '$850/ton', rating: 4.8, location: 'Galle', badge: 'Verified', type: 'Material' },
      { title: 'Organic Cotton Fabric', provider: 'Textile Suppliers', price: '$12/meter', rating: 4.9, location: 'Kurunegala', badge: 'Eco-Friendly', type: 'Material' }
    ]
  };

  return (
    <div id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Listings</h2>
          <p className="text-xl text-gray-600">Handpicked opportunities for your business</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveType('services')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeType === 'services' ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            Services
          </button>
          <button onClick={() => setActiveType('products')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeType === 'products' ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            Products
          </button>
          <button onClick={() => setActiveType('materials')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeType === 'materials' ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            Raw Materials
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings[activeType].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold mb-2">
                    {item.badge}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {item.provider}
                  </p>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-semibold text-gray-900">{item.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {item.type}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-2xl font-bold text-red-800">{item.price}</div>
                <button className="px-6 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Contact →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
