import React, { useState } from 'react';
import { Menu, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import { AxiosInstance } from '../services/Axios.service';

const translations = {
  en: {
    home: 'Home',
    services: 'Services',
    products: 'Products',
    materials: 'Raw Materials',
    why: 'Why Us',
    about: 'About Us', // ✅ added
    login: 'Log In',
    signup: 'Sign Up'
  },
  si: {
    home: 'මුල් පිටුව',
    services: 'සේවා',
    products: 'නිෂ්පාදන',
    materials: 'අමුද්‍රව්‍ය',
    why: 'ඇයි අපි',
    about: 'අපි ගැන', // ✅ added
    login: 'ඇතුල් වන්න',
    signup: 'ලියාපදිංචිය'
  }
};

const AnimatedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  const navigate = useNavigate();
  const { isLoggedIn, role, user, setIsLoggedIn, setRole, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await AxiosInstance.post('/auth/logout');
    } catch (_) { /* noop */ }
    
    // Clear all auth-related data
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('welcomed');
    
    // Reset auth context state
    setIsLoggedIn(false);
    setRole('user');
    setUser(null);
    
    navigate('/login', { replace: true });
  };

  const handleDashboardClick = () => {
    if (role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/user');
    }
  };

  return (
    <nav className="bg-white/95 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo + Links */}
          <div className="flex items-center justify-center w-full">
            <div className="flex-shrink-0 flex items-center">
              <img
                onClick={() => navigate('/')}
                src="/assets/images/logo.png"
                alt="Helasavi logo"
                className="h-8 w-15 cursor-pointer"
              />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8 justify-center w-full">
              <a href="../#services" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.services}</a>
              <a href="../#products" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.products}</a>
              <a href="../#why" className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors">{t.why}</a>
              {/* ✅ Navigate to separate About page */}
              <button
                onClick={() => navigate('/about')}
                className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.about}
              </button>
            </div>
          </div>

          {/* Right Section: Language + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLanguage(prev => prev === 'en' ? 'si' : 'en')}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors"
            >
              {language === 'en' ? 'සිං' : 'EN'}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-red-800 px-4 py-2 text-sm font-medium transition-colors text-nowrap"
            >
              {t.login}
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg text-nowrap"
            >
              {t.signup}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="../#services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.services}</a>
            <a href="../#products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.products}</a>
            <a href="../#why" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md">{t.why}</a>
            {/* ✅ Navigate to About page on mobile */}
            <button
              onClick={() => navigate('/about')}
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50 rounded-md"
            >
              {t.about}
            </button>
            {/* Mobile Auth Buttons */}
            <button
              onClick={() => navigate('/login')}
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              {t.login}
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-red-800 text-white px-3 py-2 rounded-lg text-base font-medium mt-2"
            >
              {t.signup}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AnimatedNavbar;
