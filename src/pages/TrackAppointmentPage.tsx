import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, User, Stethoscope } from 'lucide-react';

export function TrackAppointmentPage() {
  const [appointmentId, setAppointmentId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointmentId.trim()) {
      navigate(`/appointment/${appointmentId.trim()}`);
    }
  };

  const services = [
    {
      icon: User,
      title: 'Doctor',
      description: 'Find qualified doctors'
    },
    {
      icon: Calendar,
      title: 'Laboratory',
      description: 'Book lab tests'
    },
    {
      icon: Stethoscope,
      title: 'Surgery',
      description: 'Surgical procedures'
    },
    {
      icon: Clock,
      title: 'Checkup',
      description: 'Regular health checkups'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Track Your Appointment
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter your appointment ID to track your appointment status
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-16">
            <div className="flex">
              <input
                type="text"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Track
              </button>
            </div>
          </form>

          {/* Available Services */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Patients */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2 text-blue-100">
                <li><Link to="/doctors" className="hover:text-white transition-colors">Search for Doctors</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Book</Link></li>
                <li><Link to="/track" className="hover:text-white transition-colors">Booking</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Health Checkup</Link></li>
              </ul>
            </div>

            {/* For Doctors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Appointments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Doctor Dashboard</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="text-blue-100 space-y-2">
                <p>123 Healthcare Street</p>
                <p>New York, NY 10001</p>
                <p>+1 (555) 123-4567</p>
                <p>info@doctoronCall.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200">Copyright 2024 All Rights Reserved</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-blue-200 hover:text-white transition-colors">Terms and Conditions</Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}