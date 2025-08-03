import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign, GraduationCap, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { BookingSuccess } from '../components/BookingSuccess';

export function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const doctor = state.doctors.find(d => d.id === id);

  if (!doctor) {
    return <Navigate to="/doctors" replace />;
  }

  const handleBookingSuccess = (newAppointmentId: string) => {
    setAppointmentId(newAppointmentId);
  };

  const getAvailabilityColor = (availability: typeof doctor.availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: typeof doctor.availability) => {
    switch (availability) {
      case 'available':
        return 'Available Today';
      case 'busy':
        return 'Limited Availability';
      case 'unavailable':
        return 'Currently Unavailable';
      default:
        return 'Unknown';
    }
  };

  if (appointmentId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingSuccess appointmentId={appointmentId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Information */}
          <div className="lg:col-span-2">
            {/* Doctor Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {doctor.name}
                      </h1>
                      <p className="text-lg text-blue-600 font-medium mb-3">
                        {doctor.specialization}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(doctor.availability)}`}>
                      {getAvailabilityText(doctor.availability)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                      <span className="font-medium">{doctor.rating} rating</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span>${doctor.consultationFee} consultation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.name.split(' ').pop()}</h2>
              <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>

            {/* Education and Qualifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                Education & Qualifications
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-gray-700">{doctor.education}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-gray-700">Board Certified {doctor.specialization}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-gray-700">{doctor.experience}+ years of clinical experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AppointmentBooking doctor={doctor} onSuccess={handleBookingSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}