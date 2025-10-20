import React, { useState } from 'react';
import { Search, Briefcase, Package, Factory, X, MapPin, Star } from 'lucide-react';
import { Modal } from 'antd';
import axios from 'axios';
import { useLanguage } from '../context/Language.context';

const translations = {
  en: {
    heading: 'Your Gateway to',
    businessGrowth: 'Business Growth',
    subheading: 'Connect with service providers, find quality products, and source raw materials all in one platform',
    findServices: 'Find Services',
    browseProducts: 'Browse Products',
    rawMaterials: 'Raw Materials',
    searchServices: 'Search for services...',
    searchProducts: 'Search for products...',
    searchMaterials: 'Search for raw materials...',
    search: 'Search',
    activeServices: 'Active Services',
    productsListed: 'Products Listed',
    rawMaterialsCount: 'Raw Materials',
    activeUsers: 'Active Users',
    searchResultsFor: 'Search Results for',
    searching: 'Searching...',
    found: 'Found',
    results: 'results',
    result: 'result',
    noResultsTitle: 'No results found',
    noResultsDesc: 'Try adjusting your search terms or browse our categories',
    viewDetails: 'View Details',
    sriLanka: 'Sri Lanka'
  },
  si: {
    heading: 'ඔබේ ව්‍යාපාර වර්ධනය සඳහා',
    businessGrowth: 'ප්‍රධාන මාර්ගය',
    subheading: 'සේවා සපයන්නන්, ගුණාත්මක නිෂ්පාදන සහ අමුද්‍රව්‍ය සොයා ගැනීම සඳහා එක් වේදිකාවක්',
    findServices: 'සේවා සොයන්න',
    browseProducts: 'නිෂ්පාදන සොයන්න',
    rawMaterials: 'අමුද්‍රව්‍ය',
    searchServices: 'සේවා සොයන්න...',
    searchProducts: 'නිෂ්පාදන සොයන්න...',
    searchMaterials: 'අමුද්‍රව්‍ය සොයන්න...',
    search: 'සොයන්න',
    activeServices: 'සක්‍රීය සේවා',
    productsListed: 'නිෂ්පාදන',
    rawMaterialsCount: 'අමුද්‍රව්‍ය',
    activeUsers: 'සක්‍රීය පරිශීලකයින්',
    searchResultsFor: 'සෙවුම් ප්‍රතිඵල',
    searching: 'සොයමින්...',
    found: 'සොයා ගන්නා ලදී',
    results: 'ප්‍රතිඵල',
    result: 'ප්‍රතිඵලය',
    noResultsTitle: 'ප්‍රතිඵල හමු නොවීය',
    noResultsDesc: 'ඔබේ සෙවුම් වචන වෙනස් කිරීමට හෝ අපගේ වර්ග බ්‍රව්ස් කිරීමට උත්සාහ කරන්න',
    viewDetails: 'විස්තර බලන්න',
    sriLanka: 'ශ්‍රී ලංකාව'
  }
};

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const tabs = [
    { id: 'services', label: t.findServices, icon: Briefcase },
    { id: 'products', label: t.browseProducts, icon: Package },
    { id: 'materials', label: t.rawMaterials, icon: Factory }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setIsSearchModalOpen(true);

    try {
      let results = [];
      
      if (activeTab === 'services') {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`);
        const services = response.data || [];
        results = services
          .filter(service => 
            service.s_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.s_description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(service => ({
            id: service._id,
            title: service.s_category || 'Service',
            description: service.s_description || 'No description available',
            type: 'Service',
            status: service.status,
            category: service.s_category
          }));
      } else {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const products = response.data || [];
        
        results = products
          .filter(product => {
            const matchesQuery = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.p_description?.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (activeTab === 'materials') {
              const isMaterial = product.category?.toLowerCase().includes('metal') ||
                               product.category?.toLowerCase().includes('textile') ||
                               product.category?.toLowerCase().includes('fabric') ||
                               product.category?.toLowerCase().includes('alloy') ||
                               product.category?.toLowerCase().includes('chemical') ||
                               product.category?.toLowerCase().includes('wood') ||
                               product.category?.toLowerCase().includes('plastic');
              return matchesQuery && isMaterial;
            }
            
            return matchesQuery;
          })
          .map(product => ({
            id: product._id,
            title: product.name || 'Product',
            description: product.p_description || 'No description available',
            type: activeTab === 'materials' ? 'Material' : 'Product',
            price: product.price,
            category: product.category
          }));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            {t.heading} <span className="text-red-800">{t.businessGrowth}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {t.subheading}
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
                    activeTab === 'services' ? t.searchServices :
                    activeTab === 'products' ? t.searchProducts :
                    t.searchMaterials
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-transparent focus:border-red-800 focus:outline-none transition-colors"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="bg-red-800 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t.search}
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">50K+</div>
              <div className="text-gray-600 mt-1">{t.activeServices}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">10K+</div>
              <div className="text-gray-600 mt-1">{t.productsListed}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">5K+</div>
              <div className="text-gray-600 mt-1">{t.rawMaterialsCount}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-800">100K+</div>
              <div className="text-gray-600 mt-1">{t.activeUsers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-red-800" />
            <span className="text-xl font-bold">
              {t.searchResultsFor} "{searchQuery}"
            </span>
          </div>
        }
        open={isSearchModalOpen}
        onCancel={() => setIsSearchModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        {isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">{t.searching}</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto">
            <div className="mb-4 text-gray-600">
              {t.found} {searchResults.length} {searchResults.length !== 1 ? t.results : t.result}
            </div>
            <div className="space-y-4">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          {item.type}
                        </span>
                      </div>
                      {item.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{item.category}</span>
                        </div>
                      )}
                    </div>
                    {item.price && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-800">
                          Rs {item.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {item.status && (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{t.sriLanka}</span>
                    </div>
                    <button className="px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noResultsTitle}</h3>
            <p className="text-gray-600">
              {t.noResultsDesc}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HeroSection;
