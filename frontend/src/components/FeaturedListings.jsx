import React, { useState, useEffect } from 'react';
import { Briefcase, Star, MapPin } from 'lucide-react';
import axios from 'axios';

const FeaturedListings = () => {
  const [activeType, setActiveType] = useState('services');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, servicesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`)
      ]);

      setProducts(productsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to display format
  const formatListings = () => {
    const listings = {
      services: services.slice(0, 4).map(service => ({
        id: service._id,
        title: service.s_category || 'Service',
        provider: service.s_description ? service.s_description.substring(0, 50) + '...' : 'Professional Service',
        price: 'Contact for pricing',
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: service.status === 'active' ? 'Active' : 'Featured',
        type: 'Service',
        description: service.s_description
      })),
      products: products.slice(0, 4).map(product => ({
        id: product._id,
        title: product.name || 'Product',
        provider: product.category || 'Seller',
        price: `Rs ${product.price?.toLocaleString()}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: 'Available',
        type: 'Product',
        description: product.p_description
      })),
      materials: products.filter(p => 
        p.category?.toLowerCase().includes('metal') || 
        p.category?.toLowerCase().includes('textile') ||
        p.category?.toLowerCase().includes('fabric') ||
        p.category?.toLowerCase().includes('alloy')
      ).slice(0, 4).map(product => ({
        id: product._id,
        title: product.name || 'Material',
        provider: product.category || 'Supplier',
        price: `Rs ${product.price?.toLocaleString()}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: 'Verified',
        type: 'Material',
        description: product.p_description
      }))
    };

    // Fallback to sample data if no real data
    if (listings[activeType].length === 0) {
      return getSampleListings()[activeType];
    }

    return listings[activeType];
  };

  const getSampleListings = () => ({
    services: [
      { title: 'Full Stack Developer', provider: 'Tech Solutions Ltd', price: 'Rs 50,000-100,000', rating: 4.8, location: 'Remote', badge: 'Top Rated', type: 'Service' },
      { title: 'Logo Design Package', provider: 'Creative Studio', price: 'Rs 10,000-30,000', rating: 4.9, location: 'Colombo', badge: 'Featured', type: 'Service' }
    ],
    products: [
      { title: 'Industrial LED Lighting (Bulk)', provider: 'Lanka Electronics', price: 'Rs 250,000/100 units', rating: 4.7, location: 'Colombo', badge: 'Verified', type: 'Product' },
      { title: 'Office Furniture Set', provider: 'Modern Furniture Co', price: 'Rs 500,000/set', rating: 4.6, location: 'Kandy', badge: 'Popular', type: 'Product' }
    ],
    materials: [
      { title: 'Steel Sheets (Grade 304)', provider: 'Steel Industries Ltd', price: 'Rs 85,000/ton', rating: 4.8, location: 'Galle', badge: 'Verified', type: 'Material' },
      { title: 'Organic Cotton Fabric', provider: 'Textile Suppliers', price: 'Rs 1,200/meter', rating: 4.9, location: 'Kurunegala', badge: 'Eco-Friendly', type: 'Material' }
    ]
  });

  const currentListings = formatListings();

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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentListings.map((item, idx) => (
              <div key={item.id || idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
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

                {item.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                )}

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
        )}
      </div>
    </div>
  );
};

export default FeaturedListings;
