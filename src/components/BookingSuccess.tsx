import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowLeft } from 'lucide-react';

interface BookingSuccessProps {
  appointmentId: string;
}

export function BookingSuccess({ appointmentId }: BookingSuccessProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
        <p className="text-gray-600">Your appointment has been successfully booked.</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-center mb-2">
          <Calendar className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium text-green-800">Appointment ID</span>
        </div>
        <p className="text-green-700 font-mono text-sm">{appointmentId}</p>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <p>Please save your appointment ID for reference.</p>
        <p>You will receive a confirmation email shortly.</p>
      </div>

      <div className="space-y-3">
        <Link
          to="/doctors"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
        >
          Book Another Appointment
        </Link>
        <Link
          to="/"
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors block flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}