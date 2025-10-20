import React from 'react';
import { Shield, Truck, BarChart3, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/Language.context';

const translations = {
  en: {
    title: 'Why Choose HelaSavi?',
    subtitle: 'Your trusted B2B and services marketplace',
    feature1Title: 'Secure Transactions',
    feature1Desc: 'Escrow protection for all deals',
    feature2Title: 'Logistics Support',
    feature2Desc: 'We help coordinate deliveries',
    feature3Title: 'Market Insights',
    feature3Desc: 'Real-time pricing and trends',
    feature4Title: 'Quality Verified',
    feature4Desc: 'All suppliers are vetted',
    newsButton: 'News and Updates'
  },
  si: {
    title: 'ඇයි හෙලසවි තෝරාගන්න?',
    subtitle: 'ඔබේ විශ්වසනීය B2B සහ සේවා වෙළඳපොළ',
    feature1Title: 'ආරක්ෂිත ගනුදෙනු',
    feature1Desc: 'සියලුම ගනුදෙනු සඳහා එස්ක්‍රෝ ආරක්ෂාව',
    feature2Title: 'ලොජිස්ටික් සහාය',
    feature2Desc: 'අපි බෙදාහැරීම් සම්බන්ධීකරණය කිරීමට උපකාර කරමු',
    feature3Title: 'වෙළඳපල තොරතුරු',
    feature3Desc: 'තාත්වික මිල සහ ප්‍රවණතා',
    feature4Title: 'ගුණාත්මකභාවය තහවුරු කර ඇත',
    feature4Desc: 'සියලුම සැපයුම්කරුවන් පරීක්ෂා කර ඇත',
    newsButton: 'පුවත් සහ යාවත්කාලීන'
  }
};

const WhyChooseUs = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    { icon: Shield, title: t.feature1Title, desc: t.feature1Desc },
    { icon: Truck, title: t.feature2Title, desc: t.feature2Desc },
    { icon: BarChart3, title: t.feature3Title, desc: t.feature3Desc },
    { icon: CheckCircle, title: t.feature4Title, desc: t.feature4Desc }
  ];

  const handleClick = () => {
    navigate("/News");
  };

  return (
    <div className="py-20 bg-gradient-to-br from-red-800 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-red-100">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-red-100">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={handleClick}
            className="bg-white text-red-800 px-10 py-4 rounded-xl text-lg font-bold hover:bg-red-50 transition-all shadow-2xl"
          >
            {t.newsButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
