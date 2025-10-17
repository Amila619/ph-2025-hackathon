import React from 'react';
import { Shield, Truck, BarChart3, CheckCircle } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: Shield, title: 'Secure Transactions', desc: 'Escrow protection for all deals' },
    { icon: Truck, title: 'Logistics Support', desc: 'We help coordinate deliveries' },
    { icon: BarChart3, title: 'Market Insights', desc: 'Real-time pricing and trends' },
    { icon: CheckCircle, title: 'Quality Verified', desc: 'All suppliers are vetted' }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-red-800 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose FreeLanka?</h2>
          <p className="text-xl text-red-100">Your trusted B2B and services marketplace</p>
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
          <button className="bg-white text-red-800 px-10 py-4 rounded-xl text-lg font-bold hover:bg-red-50 transition-all shadow-2xl">
            Start Trading Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
