import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-red-800 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
              <span className="ml-3 text-xl font-bold text-white">FreeLanka</span>
            </div>
            <p className="text-sm">Your complete B2B marketplace for services, products, and raw materials.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Find Services</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Browse Products</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Raw Materials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">List Services</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Sell Products</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Supply Materials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 FreeLanka. Your trusted B2B marketplace for Sri Lanka and beyond.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
