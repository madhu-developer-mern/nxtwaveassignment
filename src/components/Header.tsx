import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Home, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const location = useLocation();
  const { state, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">DoctorOnCall</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/doctors"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/doctors') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Doctors</span>
            </Link>
            <Link
              to="/track"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/track') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Track</span>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            {state.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {state.user?.name}</span>
                {state.user?.role === 'doctor' && (
                  <Link
                    to="/doctor/dashboard"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login/patient"
                  className="text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/doctors"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}