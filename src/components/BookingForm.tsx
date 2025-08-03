import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Check, AlertCircle } from 'lucide-react';
import { Doctor, BookingFormData } from '../types';
import { useApp } from '../context/AppContext';

interface BookingFormProps {
  doctor: Doctor;
  onSuccess: (appointmentId: string) => void;
}

interface FormErrors {
  patientName?: string;
  patientEmail?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export function BookingForm({ doctor, onSuccess }: BookingFormProps) {
  const { bookAppointment } = useApp();
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    } else if (formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Patient name must be at least 2 characters';
    }

    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Appointment time is required';
    } else if (!doctor.availableSlots.includes(formData.appointmentTime)) {
      newErrors.appointmentTime = 'Please select an available time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appointmentId = bookAppointment(doctor.id, formData);
      onSuccess(appointmentId);
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        Book Appointment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Name */}
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Patient Name
          </label>
          <input
            type="text"
            id="patientName"
            value={formData.patientName}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.patientName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.patientName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.patientName}
            </p>
          )}
        </div>

        {/* Patient Email */}
        <div>
          <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            id="patientEmail"
            value={formData.patientEmail}
            onChange={(e) => handleInputChange('patientEmail', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.patientEmail ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.patientEmail && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.patientEmail}
            </p>
          )}
        </div>

        {/* Appointment Date */}
        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Appointment Date
          </label>
          <input
            type="date"
            id="appointmentDate"
            value={formData.appointmentDate}
            onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
            min={getTomorrowDate()}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.appointmentDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.appointmentDate && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.appointmentDate}
            </p>
          )}
        </div>

        {/* Appointment Time */}
        <div>
          <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Available Time Slots
          </label>
          {doctor.availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {doctor.availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleInputChange('appointmentTime', slot)}
                  className={`p-2 border rounded-lg text-sm font-medium transition-all ${
                    formData.appointmentTime === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              No available time slots for this doctor.
            </p>
          )}
          {errors.appointmentTime && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.appointmentTime}
            </p>
          )}
        </div>

        {/* Consultation Fee */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Consultation Fee:</span>
            <span className="text-lg font-semibold text-blue-600">${doctor.consultationFee}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || doctor.availableSlots.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Booking Appointment...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Book Appointment
            </>
          )}
        </button>
      </form>
    </div>
  );
}