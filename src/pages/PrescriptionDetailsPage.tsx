import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Pill, FileText, Activity, Phone, Mail, MapPin, Download, Printer as Print } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  instructions: string;
  diagnosis: string;
  symptoms: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };
  labTests: string[];
  followUpInstructions: string;
  nextAppointment: string | null;
  status: string;
  createdAt: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  education: string;
  location: string;
  phone: string;
  email: string;
  licenseNumber: string;
}

export function PrescriptionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptionDetails();
  }, [id]);

  const fetchPrescriptionDetails = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prescription details');
      }

      const prescriptionData = await response.json();
      setPrescription(prescriptionData);

      // Fetch doctor details
      const doctorResponse = await fetch(`/api/doctors/${prescriptionData.doctorId}`);
      if (doctorResponse.ok) {
        const doctorData = await doctorResponse.json();
        setDoctor(doctorData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescription');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Download functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescription Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The prescription could not be found.'}</p>
            <Link
              to="/patient/prescriptions"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Prescriptions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/patient/prescriptions"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
            >
              <Print className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Prescription Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Medical Prescription</h2>
                <p className="text-blue-100">Prescription ID: {prescription.id}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Date Issued</p>
                <p className="font-semibold">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Doctor Information */}
            {doctor && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                  Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-semibold text-gray-900">{doctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="font-semibold text-gray-900">{doctor.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="font-semibold text-gray-900">{doctor.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {doctor.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {doctor.phone}
                      </p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {doctor.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Information */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-green-600 mr-2" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-semibold text-gray-900">{state.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patient ID</p>
                  <p className="font-semibold text-gray-900">{prescription.patientId}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis and Symptoms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 text-red-600 mr-2" />
                Diagnosis & Symptoms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {prescription.diagnosis || 'No diagnosis recorded'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {prescription.symptoms || 'No symptoms recorded'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.vitalSigns.bloodPressure || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.vitalSigns.heartRate || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.vitalSigns.temperature || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.vitalSigns.weight || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.vitalSigns.height || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="h-5 w-5 text-purple-600 mr-2" />
                Prescribed Medications
              </h3>
              {prescription.medications.length > 0 ? (
                <div className="space-y-4">
                  {prescription.medications.map((medication, index) => (
                    <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage</p>
                          <p className="font-medium text-gray-900">{medication.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frequency</p>
                          <p className="font-medium text-gray-900">{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium text-gray-900">{medication.duration}</p>
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-3">
                          <p className="text-gray-600 text-sm">Instructions</p>
                          <p className="text-gray-900">{medication.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">No medications prescribed</p>
              )}
            </div>

            {/* Lab Tests */}
            {prescription.labTests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Lab Tests</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {prescription.labTests.map((test, index) => (
                      <li key={index} className="flex items-center text-gray-900">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-orange-600 mr-2" />
                General Instructions
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-900">
                  {prescription.instructions || 'No specific instructions provided'}
                </p>
              </div>
            </div>

            {/* Follow-up Instructions */}
            {prescription.followUpInstructions && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Instructions</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-900">{prescription.followUpInstructions}</p>
                </div>
              </div>
            )}

            {/* Next Appointment */}
            {prescription.nextAppointment && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  Next Appointment
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(prescription.nextAppointment).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <p>This prescription is valid for 30 days from the date of issue.</p>
                <p>Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}