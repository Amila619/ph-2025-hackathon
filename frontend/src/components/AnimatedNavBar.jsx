import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const translations = {
  en: { home: 'Home', services: 'Services', products: 'Products', materials: 'Raw Materials', why: 'Why Us', login: 'Log In', signup: 'Sign Up' },
  si: { home: 'මුල් පිටුව', services: 'සේවා', products: 'නිෂ්පාදන', materials: 'අමුද්‍රව්‍ය', why: 'ඇයි අපි', login: 'ඇතුල් වන්න', signup: 'ලියාපදිංචිය' }
};

const AnimatedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  return (
    <nav className="bg-white/95 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-red-800 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                F
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">FreeLanka</span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.home}</a>
              <a href="#services" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.services}</a>
              <a href="#products" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.products}</a>
              <a href="#materials" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.materials}</a>
              <a href="#why" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.why}</a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => setLanguage(prev => prev === 'en' ? 'si' : 'en')} className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
              {language === 'en' ? 'සිං' : 'EN'}
            </button>
            <button className="text-gray-700 hover:text-red-800 px-4 py-2 text-sm font-medium transition-colors">{t.login}</button>
            <button className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">{t.signup}</button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.home}</a>
            <a href="#services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.services}</a>
            <a href="#products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.products}</a>
            <a href="#materials" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.materials}</a>
            <a href="#why" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.why}</a>
            <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">{t.login}</button>
            <button className="w-full bg-red-800 text-white px-3 py-2 rounded-lg text-base font-medium mt-2">{t.signup}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AnimatedNavbar;
