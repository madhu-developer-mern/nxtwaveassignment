import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Doctor, BookingFormData } from '../types';
import { useApp } from '../context/AppContext';

interface AppointmentBookingProps {
  doctor: Doctor;
  onSuccess: (appointmentId: string) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function AppointmentBooking({ doctor, onSuccess }: AppointmentBookingProps) {
  const { bookAppointment } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Generate calendar dates
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'long' }),
        year: date.getFullYear(),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Time slots
  const morningSlots: TimeSlot[] = [
    { time: '08:00 AM', available: true },
    { time: '08:30 AM', available: true },
    { time: '09:00 AM', available: false },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true }
  ];

  const afternoonSlots: TimeSlot[] = [
    { time: '01:00 PM', available: true },
    { time: '01:30 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: false },
    { time: '03:00 PM', available: true },
    { time: '03:30 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '04:30 PM', available: true }
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedDate && selectedTime) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: BookingFormData = {
      patientName: patientInfo.name,
      patientEmail: patientInfo.email,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime
    };

    const appointmentId = bookAppointment(doctor.id, formData);
    onSuccess(appointmentId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Make an Appointment</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
            }`}>
              1
            </div>
            <div className="w-8 h-0.5 bg-blue-400"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
            }`}>
              2
            </div>
            <div className="w-8 h-0.5 bg-blue-400"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
            }`}>
              3
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-white' : 'text-blue-200'}`}>
            <Calendar className="h-4 w-4" />
            <span>Select appointment Date & Time</span>
          </div>
          <div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-white' : 'text-blue-200'}`}>
            <User className="h-4 w-4" />
            <span>Patient Information</span>
          </div>
          <div className={`flex items-center space-x-2 ${currentStep === 3 ? 'text-white' : 'text-blue-200'}`}>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentStep === 1 && (
          <div>
            {/* Doctor Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{doctor.location}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pick a Date</h3>
                <div className="grid grid-cols-2 gap-3">
                  {calendarDates.slice(0, 6).map((dateObj, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(dateObj.fullDate)}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedDate === dateObj.fullDate
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-2xl font-bold text-blue-600">{dateObj.date}</div>
                      <div className="text-sm text-gray-600">{dateObj.day}</div>
                      <div className="text-xs text-gray-500">{dateObj.month} {dateObj.year}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pick a Time</h3>
                
                {/* Morning Slots */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Morning Time (8AM - 12PM)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {morningSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 text-sm border rounded transition-all ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : slot.available
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    After Noon Time (1PM - 5PM)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {afternoonSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 text-sm border rounded transition-all ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : slot.available
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Appointment Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Doctor:</span> {doctor.name}</p>
                  <p><span className="font-medium">Date:</span> {selectedDate}</p>
                  <p><span className="font-medium">Time:</span> {selectedTime}</p>
                  <p><span className="font-medium">Fee:</span> ${doctor.consultationFee}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}