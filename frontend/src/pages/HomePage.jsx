import React from 'react';

import HeroSection from '../components/HeroSection';
import MarketplaceTabs from '../components/MarketplaceTabs';
import FeaturedListings from '../components/FeaturedListings';
import HowItWorks from '../components/HowLtWorks';
import WhyChooseUs from '../components/WhyChooseUs';
//import Contact from './Contact';
import { FloatButton } from 'antd';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <section id="services">
        <MarketplaceTabs />
      </section>

      <section id="products">
        <FeaturedListings />
      </section>

      <section id="how">
        <HowItWorks />
      </section>

      <section id="why">
        <WhyChooseUs />
      </section>
      <FloatButton
        style={{ insetBlockEnd: 175 }}
        tooltip={{
          // tooltipProps is supported starting from version 5.25.0.
          title: 'Since 5.25.0+',
          color: 'blue',
          placement: 'top',
        }}
      />
      <FloatButton
        style={{ insetBlockEnd: 108 }}
        tooltip={{
          // tooltipProps is supported starting from version 5.25.0.
          title: 'Since 5.25.0+',
          color: 'blue',
          placement: 'top',
        }}
      />
      <FloatButton tooltip={<div>Documents</div>} />
      
    </div>
  );
}
