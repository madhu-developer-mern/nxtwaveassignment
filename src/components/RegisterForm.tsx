import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, MapPin, GraduationCap, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';

interface RegisterFormProps {
  userType: 'patient' | 'doctor' | 'admin';
  onSuccess?: () => void;
}

export function RegisterForm({ userType, onSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    role: userType,
    specialization: '',
    experience: 0,
    education: '',
    location: '',
    about: '',
    consultationFee: 0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (userType) {
      case 'doctor':
        return 'Doctor Registration';
      case 'admin':
        return 'Admin Registration';
      default:
        return 'Patient Registration';
    }
  };

  const getLoginLink = () => {
    switch (userType) {
      case 'doctor':
        return '/login/doctor';
      case 'admin':
        return '/login/admin';
      default:
        return '/login/patient';
    }
  };

  const specializations = [
    'Cardiologist',
    'Pediatrician',
    'Dermatologist',
    'Orthopedic Surgeon',
    'Gynecologist',
    'Neurologist',
    'General Practitioner',
    'Psychiatrist',
    'Ophthalmologist',
    'ENT Specialist'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    required
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="education"
                      type="text"
                      required
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MD, Harvard Medical School"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Downtown Medical Center"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="consultationFee"
                      type="number"
                      min="0"
                      required
                      value={formData.consultationFee}
                      onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Consultation fee"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    id="about"
                    rows={3}
                    required
                    value={formData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about yourself and your practice"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={getLoginLink()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}