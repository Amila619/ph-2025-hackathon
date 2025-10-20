import React from 'react';
import { Users, Search, Shield, Award } from 'lucide-react';
import { useLanguage } from '../context/Language.context';

const translations = {
  en: {
    title: 'How It Works',
    subtitle: 'Get started in 4 simple steps',
    step1Title: 'Create Account',
    step1Desc: 'Sign up as a buyer, seller, or service provider in minutes',
    step2Title: 'Browse & Connect',
    step2Desc: 'Find what you need or list your offerings on our platform',
    step3Title: 'Secure Transaction',
    step3Desc: 'Complete deals safely with our escrow payment system',
    step4Title: 'Build Reputation',
    step4Desc: 'Rate and review to build trust in the community'
  },
  si: {
    title: 'එය ක්‍රියාත්මක වන ආකාරය',
    subtitle: 'සරල පියවර 4 කින් ආරම්භ කරන්න',
    step1Title: 'ගිණුමක් සාදන්න',
    step1Desc: 'මිනිත්තු කිහිපයකින් ගැනුම්කරුවෙකු, විකුණුම්කරුවෙකු හෝ සේවා සපයන්නෙකු ලෙස ලියාපදිංචි වන්න',
    step2Title: 'සොයන්න සහ සම්බන්ධ වන්න',
    step2Desc: 'ඔබට අවශ්‍ය දේ සොයා ගන්න හෝ අපගේ වේදිකාවේ ඔබේ දේවල් ලැයිස්තුගත කරන්න',
    step3Title: 'ආරක්ෂිත ගනුදෙනු',
    step3Desc: 'අපගේ එස්ක්‍රෝ ගෙවීම් පද්ධතිය සමඟ ආරක්ෂිතව ගනුදෙනු සම්පූර්ණ කරන්න',
    step4Title: 'කීර්තිය ගොඩනඟන්න',
    step4Desc: 'ප්‍රජාව තුළ විශ්වාසය ගොඩනැගීමට ඇගයීම් සහ සමාලෝචන කරන්න'
  }
};

const HowItWorks = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const steps = [
    { icon: Users, title: t.step1Title, desc: t.step1Desc },
    { icon: Search, title: t.step2Title, desc: t.step2Desc },
    { icon: Shield, title: t.step3Title, desc: t.step3Desc },
    { icon: Award, title: t.step4Title, desc: t.step4Desc }
  ];

  return (
    <div id="why" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-800 to-red-300"></div>
                  )}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
