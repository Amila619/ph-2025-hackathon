import React from 'react';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-hidden py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center mb-8">
                            <img
                                src="/assets/images/logo.png"   
                                alt="FreeLanka Logo"
                                className="h-10 max-w-full rounded-lg object-cover"
                            />
                        </div>
                        <p className="text-sm text-gray-700">Your complete B2B marketplace for services, products, and raw materials.</p>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Marketplace</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-red-600 transition-colors">Find Services</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Browse Products</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Raw Materials</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">For Sellers</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-red-600 transition-colors">List Services</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Sell Products</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Supply Materials</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-red-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-8 text-center text-sm">
                    <p>&copy; 2025 Helasavi. Your trusted marketplace for Sri Lanka and beyond.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
