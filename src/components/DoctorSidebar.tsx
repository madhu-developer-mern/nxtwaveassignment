import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  Settings, 
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DoctorSidebar() {
  const location = useLocation();
  const { state, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: Clock, label: 'Schedule', path: '/doctor/schedule' },
    { icon: FileText, label: 'Medical Records', path: '/doctor/records' },
    { icon: Bell, label: 'Notifications', path: '/doctor/notifications' },
    { icon: Settings, label: 'Settings', path: '/doctor/settings' }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      {/* Doctor Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Doctor"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{state.user?.name || 'Doctor'}</h3>
            <p className="text-sm text-gray-600">Cardiologist</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}