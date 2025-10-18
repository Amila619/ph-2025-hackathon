import React from 'react';
import AnimatedNavbar from '../components/navbar/AnimatedNavbar';
import HeroSection from '../components/Hero/HeroSection';
import MarketplaceTabs from '../components/Marketplace/MarketplaceTabs';
import FeaturedListings from '../components/Featured/FeaturedListings';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Footer from '../components/Footer/Footer';
// import SignUpintro from '../components/SignUpintro';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <AnimatedNavbar />
      <HeroSection />
      <MarketplaceTabs />
      <FeaturedListings />
      <HowItWorks />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
