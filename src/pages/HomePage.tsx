import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, Star } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Trusted Healthcare',
      description: 'Board-certified doctors with verified credentials and extensive experience.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book appointments anytime with flexible scheduling options.'
    },
    {
      icon: Users,
      title: 'Expert Specialists',
      description: 'Access to a wide range of medical specialists for comprehensive care.'
    },
    {
      icon: Star,
      title: 'Quality Care',
      description: 'Highly rated doctors committed to providing exceptional patient care.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Patients Served' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '15+', label: 'Specializations' },
    { number: '4.9', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Most Trusted
              <span className="text-blue-600 block mt-2">Health Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with qualified healthcare professionals and book appointments with ease. 
              Your health is our priority, and we're here to provide exceptional care when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/doctors"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/doctors"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Find Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="max-w-4xl mx-auto">
            <img
              src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Healthcare professionals"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare solutions with a focus on quality, 
              accessibility, and patient satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and take the first step towards better health.
          </p>
          <Link
            to="/doctors"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Book Appointment Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}