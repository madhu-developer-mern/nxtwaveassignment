import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppointmentTimeline } from '../types';

export function AppointmentResultPage() {
  const { id } = useParams<{ id: string }>();
  const { getAppointmentById, getDoctorById } = useApp();

  const appointment = getAppointmentById(id || '');
  const doctor = appointment ? getDoctorById(appointment.doctorId) : undefined;

  if (!appointment || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h2>
            <p className="text-gray-600 mb-6">
              The appointment ID you entered could not be found. Please check your appointment ID and try again.
            </p>
            <Link
              to="/track"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // Mock timeline data
  const timeline: AppointmentTimeline[] = [
    {
      id: '1',
      title: 'Payment - paid',
      description: 'Payment has been successfully processed for your appointment',
      date: new Date(appointment.createdAt).toLocaleDateString(),
      time: new Date(appointment.createdAt).toLocaleTimeString(),
      status: 'completed',
      icon: 'payment'
    },
    {
      id: '2',
      title: 'Appointment - confirmed',
      description: 'Your appointment has been confirmed with the doctor',
      date: new Date(appointment.createdAt).toLocaleDateString(),
      time: new Date(appointment.createdAt).toLocaleTimeString(),
      status: 'completed',
      icon: 'confirmed'
    },
    {
      id: '3',
      title: 'Follow up - Not Completed yet',
      description: 'Follow-up appointment will be scheduled after consultation',
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      status: 'upcoming',
      icon: 'followup'
    },
    {
      id: '4',
      title: 'Prescription - delivered',
      description: 'Prescription will be provided after the consultation',
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      status: 'upcoming',
      icon: 'prescription'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/track"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Track Appointment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              {/* Doctor Card - Confirmed */}
              <div className="bg-green-500 text-white p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-green-100 text-sm">{doctor.specialization}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 ml-auto" />
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>doctor@hospital.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Card - Cancelled (Mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-500 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {appointment.patientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">John Cooper</h3>
                    <p className="text-red-100 text-sm">Patient - Cancelled Appointment</p>
                  </div>
                  <XCircle className="h-6 w-6 ml-auto" />
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Appointment was cancelled</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+1 (555) 987-6543</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>john.cooper@email.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Appointment Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Status - {appointment.status === 'confirmed' ? 'pending' : appointment.status}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-2 capitalize">{appointment.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Appointment ID:</span>
                      <span className="ml-2 font-mono text-blue-600">{appointment.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Meeting Schedule</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Appointment Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p>Appointment Time: {appointment.appointmentTime}</p>
                    <p>Duration: 30 minutes</p>
                    <p>Type: In-person consultation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Timeline</h2>
              
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed' 
                        ? 'bg-green-100' 
                        : item.status === 'current'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : item.status === 'current' ? (
                        <Clock className="h-5 w-5 text-blue-600" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          item.status === 'completed' ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {item.date} at {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    
                    {index < timeline.length - 1 && (
                      <div className="absolute left-9 mt-10 w-px h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2 text-blue-100">
                <li><Link to="/doctors" className="hover:text-white transition-colors">Search for Doctors</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Book</Link></li>
                <li><Link to="/track" className="hover:text-white transition-colors">Booking</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Health Checkup</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Appointments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Doctor Dashboard</a></li>
              </ul>
            </div>
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