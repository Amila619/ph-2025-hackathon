import React, { useState, useEffect } from 'react';
import { Briefcase, Star, MapPin, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import { message } from 'antd';
import axios from 'axios';
import { AxiosInstance } from '../services/Axios.service';

const FeaturedListings = () => {
  const [activeType, setActiveType] = useState('services');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

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
        sellerId: service.seller_id,
        title: service.s_category || 'Service',
        provider: service.s_description ? service.s_description.substring(0, 50) + '...' : 'Professional Service',
        price: 'Contact for pricing',
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: service.status === 'active' ? 'Active' : 'Featured',
        type: 'Service',
        itemType: 'service',
        description: service.s_description
      })),
      products: products.slice(0, 4).map(product => ({
        id: product._id,
        sellerId: product.seller_id,
        title: product.name || 'Product',
        provider: product.category || 'Seller',
        price: `Rs ${product.price?.toLocaleString()}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: 'Available',
        type: 'Product',
        itemType: 'product',
        description: product.p_description
      })),
      materials: products.filter(p => 
        p.category?.toLowerCase().includes('metal') || 
        p.category?.toLowerCase().includes('textile') ||
        p.category?.toLowerCase().includes('fabric') ||
        p.category?.toLowerCase().includes('alloy')
      ).slice(0, 4).map(product => ({
        id: product._id,
        sellerId: product.seller_id,
        title: product.name || 'Material',
        provider: product.category || 'Supplier',
        price: `Rs ${product.price?.toLocaleString()}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        location: 'Sri Lanka',
        badge: 'Verified',
        type: 'Material',
        itemType: 'product',
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
      { id: 'sample-s1', sellerId: 'sample-seller', title: 'Full Stack Developer', provider: 'Tech Solutions Ltd', price: 'Rs 50,000-100,000', rating: 4.8, location: 'Remote', badge: 'Top Rated', type: 'Service', itemType: 'service' },
      { id: 'sample-s2', sellerId: 'sample-seller', title: 'Logo Design Package', provider: 'Creative Studio', price: 'Rs 10,000-30,000', rating: 4.9, location: 'Colombo', badge: 'Featured', type: 'Service', itemType: 'service' }
    ],
    products: [
      { id: 'sample-p1', sellerId: 'sample-seller', title: 'Industrial LED Lighting (Bulk)', provider: 'Lanka Electronics', price: 'Rs 250,000/100 units', rating: 4.7, location: 'Colombo', badge: 'Verified', type: 'Product', itemType: 'product' },
      { id: 'sample-p2', sellerId: 'sample-seller', title: 'Office Furniture Set', provider: 'Modern Furniture Co', price: 'Rs 500,000/set', rating: 4.6, location: 'Kandy', badge: 'Popular', type: 'Product', itemType: 'product' }
    ],
    materials: [
      { id: 'sample-m1', sellerId: 'sample-seller', title: 'Steel Sheets (Grade 304)', provider: 'Steel Industries Ltd', price: 'Rs 85,000/ton', rating: 4.8, location: 'Galle', badge: 'Verified', type: 'Material', itemType: 'product' },
      { id: 'sample-m2', sellerId: 'sample-seller', title: 'Organic Cotton Fabric', provider: 'Textile Suppliers', price: 'Rs 1,200/meter', rating: 4.9, location: 'Kurunegala', badge: 'Eco-Friendly', type: 'Material', itemType: 'product' }
    ]
  });

  const currentListings = formatListings();

  const handleAddToCart = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Add to cart clicked', { item, isLoggedIn });
    
    if (!isLoggedIn) {
      message.warning('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (item.itemType !== 'product') {
      message.info('Only products can be added to cart');
      return;
    }

    try {
      console.log('Sending cart request:', { kind: 'Product', refId: item.id, qty: 1 });
      const response = await AxiosInstance.post('/cart/add', {
        kind: 'Product',
        refId: item.id,
        qty: 1
      });
      console.log('Cart response:', response);
      // Success message shown by Axios interceptor
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Error message shown by Axios interceptor
    }
  };

  const handleContactSeller = (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('=== CONTACT SELLER CLICKED ===');
    console.log('Item:', item);
    console.log('isLoggedIn:', isLoggedIn);
    console.log('User:', user);
    
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login');
      message.warning('Please login to contact sellers');
      navigate('/login');
      return;
    }

    // Check if user is trying to contact themselves
    const currentUserId = user?._id || user?.id;
    if (item.sellerId === currentUserId) {
      console.log('User trying to contact themselves');
      message.warning('You cannot contact yourself. This is your own listing!');
      return;
    }

    const navigationState = {
      sellerId: item.sellerId,
      itemId: item.id,
      itemType: item.itemType,
      itemName: item.title
    };
    
    console.log('Navigating to /contact with state:', navigationState);
    
    try {
      navigate('/contact', { state: navigationState });
      console.log('Navigation called successfully');
    } catch (error) {
      console.error('Navigation error:', error);
    }
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentListings.map((item, idx) => (
              <div key={item.id || idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
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
                  <div className="flex gap-2">
                    {/* Only show Add to Cart for products that aren't the user's own */}
                    {item.itemType === 'product' && item.sellerId !== (user?._id || user?.id) && (
                      <button 
                        onClick={(e) => handleAddToCart(item, e)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    )}
                    {/* Only show Contact Seller button if it's not the user's own listing */}
                    {item.sellerId !== (user?._id || user?.id) ? (
                      <button 
                        onClick={(e) => handleContactSeller(item, e)}
                        className="px-6 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Contact Seller
                      </button>
                    ) : (
                      <span className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium">
                        Your Listing
                      </span>
                    )}
                  </div>
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
