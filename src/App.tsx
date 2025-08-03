import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { TrackAppointmentPage } from './pages/TrackAppointmentPage';
import { AppointmentResultPage } from './pages/AppointmentResultPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorAppointments } from './pages/DoctorAppointments';
import { PatientDashboard } from './pages/PatientDashboard';
import { PrescriptionDetailsPage } from './pages/PrescriptionDetailsPage';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <HomePage />
                </>
              } />
              <Route path="/doctors" element={
                <>
                  <Header />
                  <DoctorsPage />
                </>
              } />
              <Route path="/doctor/:id" element={
                <>
                  <Header />
                  <DoctorProfilePage />
                </>
              } />
              <Route path="/track" element={
                <>
                  <Header />
                  <TrackAppointmentPage />
                </>
              } />
              <Route path="/appointment/:id" element={
                <>
                  <Header />
                  <AppointmentResultPage />
                </>
              } />
              <Route path="/prescription/:id" element={
                <>
                  <Header />
                  <PrescriptionDetailsPage />
                </>
              } />
              
              {/* Auth Routes */}
              <Route path="/login/patient" element={<LoginForm userType="patient" />} />
              <Route path="/login/doctor" element={<LoginForm userType="doctor" />} />
              <Route path="/login/admin" element={<LoginForm userType="admin" />} />
              <Route path="/register/patient" element={<RegisterForm userType="patient" />} />
              <Route path="/register/doctor" element={<RegisterForm userType="doctor" />} />
              <Route path="/register/admin" element={<RegisterForm userType="admin" />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={
                <>
                  <Header />
                  <PatientDashboard />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;