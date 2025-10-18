import React, { useState } from 'react';
import { Users, Target, Award, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting HelaSavi! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower local businesses and connect buyers and sellers through trust and technology."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Our Team",
      description: "A passionate group of innovators, developers, and business experts working towards a connected Sri Lanka."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Our Values",
      description: "Integrity, transparency, and collaboration form the core of everything we do at HelaSavi."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Our Promise",
      description: "To create opportunities, foster growth, and make digital trade accessible for all."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600 text-white">
      {/* Hero Section */}
      <div className="py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-6">About HelaSavi</h1>
        <p className="text-lg text-red-100 max-w-2xl mx-auto">
          We are redefining the future of digital trade — connecting Sri Lankan industries, services, and innovation under one trusted platform.
        </p>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-red-800">Our Story</h2>
          <p className="leading-relaxed mb-4">
            Founded with a vision to strengthen Sri Lanka’s B2B ecosystem, HelaSavi began as a small initiative by a group of young innovators determined to empower local businesses. 
            Today, HelaSavi stands as a trusted online marketplace for services and raw materials, bridging the gap between suppliers, buyers, and service providers.
          </p>
          <p className="leading-relaxed">
            Our platform ensures transparent and secure transactions, verified vendors, and equal opportunities for all — driving sustainable digital growth across industries.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Drives Us</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300 text-center"
            >
              <div className="flex justify-center mb-4 text-red-700">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-800">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white text-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-red-800">Get In Touch</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Have a question, suggestion, or partnership inquiry? Our team is always ready to connect.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-red-50 rounded-xl shadow p-6 flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Email Us</h3>
                  <p className="text-gray-700 text-sm">info@helasavi.lk</p>
                  <p className="text-gray-700 text-sm">support@helasavi.lk</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl shadow p-6 flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Call Us</h3>
                  <p className="text-gray-700 text-sm">+94 77 123 4567</p>
                  <p className="text-gray-700 text-sm">Mon–Fri, 9am–6pm</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl shadow p-6 flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Visit Us</h3>
                  <p className="text-gray-700 text-sm">123 Business Street, Colombo 07</p>
                  <p className="text-gray-700 text-sm">Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-red-50 rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-red-800 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-red-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-red-800 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-red-800 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold text-red-800 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-800 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}