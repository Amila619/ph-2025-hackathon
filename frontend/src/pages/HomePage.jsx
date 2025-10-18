import React from 'react';
import HeroSection from '../components/HeroSection';
import MarketplaceTabs from '../components/MarketplaceTabs';
import FeaturedListings from '../components/FeaturedListings';
import HowItWorks from '../components/HowLtWorks';
import WhyChooseUs from '../components/WhyChooseUs';

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
    </div>
  );
}
