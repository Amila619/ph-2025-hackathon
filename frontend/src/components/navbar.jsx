import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, TrendingUp, Newspaper, Info, UserPlus, LogIn } from 'lucide-react';

const HouseIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const AnimatedNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectorStyle, setSelectorStyle] = useState({});
  const navRef = useRef(null);

  const translations = {
    en: {
      logo: 'Logo',
      home: 'Home',
      market: 'Market',
      news: 'News',
      about: 'About Us',
      signup: 'Sign Up',
      login: 'Login',
    },
    si: {
      logo: 'ලාංඡනය',
      home: 'මුල් පිටුව',
      market: 'වෙළඳපොළ',
      news: 'පුවත්',
      about: 'අප ගැන',
      signup: 'ලියාපදිංචිය',
      login: 'ඇතුල් වන්න',
    },
  };

  const t = translations[language];

  const menuItems = [
    { icon: HouseIcon, label: t.home },
    { icon: TrendingUp, label: t.market },
    { icon: Newspaper, label: t.news },
    { icon: Info, label: t.about },
    { icon: UserPlus, label: t.signup },
    { icon: LogIn, label: t.login },
  ];

  const updateSelector = useCallback((index) => {
    if (navRef.current && navRef.current.children.length > index) {
      const activeItem = navRef.current.children[index];
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeItem;
      setSelectorStyle({
        left: `${offsetLeft}px`,
        top: `${offsetTop}px`,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
      });
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => updateSelector(activeIndex));
    return () => cancelAnimationFrame(raf);
  }, [activeIndex, language, updateSelector]);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => updateSelector(activeIndex));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, updateSelector]);

  const handleClick = (index) => {
    setActiveIndex(index);
    setIsOpen(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index);
    }
  };

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'si' : 'en'));
  const handleLanguageKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLanguage();
    }
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg shadow-md rounded-b-xl relative" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
  <img
    src="/assets/images/logo.png"
    alt="Logo"
    className="h-10 w-auto" // adjust height as needed
  />
</a>

        {/* Hamburger menu for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-black p-2 hover:text-gray-700 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>

        {/* Menu */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } lg:flex lg:items-center w-full lg:w-auto absolute lg:relative top-full lg:top-auto left-0 bg-white/10 backdrop-blur-lg z-50 rounded-b-xl shadow-md`}
        >
          <div className="relative flex-1">
            {/* Animated selector */}
            <div
              className="absolute bg-black/10 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] rounded-xl pointer-events-none shadow-md"
              style={selectorStyle}
            />

            {/* Menu items */}
            <ul ref={navRef} className="flex flex-col lg:flex-row lg:ml-auto relative" role="menubar">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="relative" role="none">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(index);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`flex items-center px-6 py-3 lg:py-5 text-[16px] transition-all duration-300 relative z-10 select-none cursor-pointer hover:[#8A1717] hover:scale-105 ${
                        activeIndex === index ? 'text-black font-semibold' : 'text-black/70'
                      }`}
                      aria-current={activeIndex === index ? 'page' : undefined}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <Icon className="mr-3" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Language toggle */}
          <div className="flex items-center px-6 py-3 lg:py-0 lg:ml-4 border-t lg:border-t-0 lg:border-l border-black/20">
            <button
              onClick={toggleLanguage}
              onKeyDown={handleLanguageKeyDown}
              className="relative inline-flex items-center h-8 w-16 rounded-full bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-black/40"
              aria-label="Toggle language"
              type="button"
            >
              {/* Sliding knob */}
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-black shadow-md transition-all duration-300 ${
                  language === 'en' ? 'translate-x-0' : 'translate-x-8'
                }`}
              />

              {/* Labels */}
              <span className="absolute left-2 text-black text-xs font-medium select-none">EN</span>
              <span className="absolute right-2 text-black text-xs font-medium select-none">සි</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AnimatedNavbar;
