import React from 'react';
import { Users, Search, Shield, Award } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { icon: Users, title: 'Create Account', desc: 'Sign up as a buyer, seller, or service provider in minutes' },
    { icon: Search, title: 'Browse & Connect', desc: 'Find what you need or list your offerings on our platform' },
    { icon: Shield, title: 'Secure Transaction', desc: 'Complete deals safely with our escrow payment system' },
    { icon: Award, title: 'Build Reputation', desc: 'Rate and review to build trust in the community' }
  ];

  return (
    <div id="why" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
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
