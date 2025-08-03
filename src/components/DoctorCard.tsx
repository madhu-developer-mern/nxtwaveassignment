import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const getAvailabilityColor = (availability: Doctor['availability']) => {
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

  const getAvailabilityText = (availability: Doctor['availability']) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={doctor.profileImage}
          alt={doctor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
            {getAvailabilityText(doctor.availability)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {doctor.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
          </div>
        </div>

        <p className="text-blue-600 font-medium mb-3">{doctor.specialization}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{doctor.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>${doctor.consultationFee} consultation</span>
          </div>
        </div>

        <Link
          to={`/doctor/${doctor.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
        >
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}