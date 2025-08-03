import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Doctor, Appointment, BookingFormData } from '../types';
import { doctors } from '../data/doctors';

interface AppState {
  doctors: Doctor[];
  appointments: Appointment[];
  searchTerm: string;
  selectedSpecialization: string;
}

type AppAction = 
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SPECIALIZATION'; payload: string }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_DOCTOR_AVAILABILITY'; payload: { doctorId: string; availability: Doctor['availability'] } }
  | { type: 'UPDATE_APPOINTMENT_STATUS'; payload: { appointmentId: string; status: Appointment['status'] } };

const initialState: AppState = {
  doctors,
  appointments: [],
  searchTerm: '',
  selectedSpecialization: ''
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  bookAppointment: (doctorId: string, formData: BookingFormData) => string;
  getFilteredDoctors: () => Doctor[];
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  getDoctorById: (doctorId: string) => Doctor | undefined;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SPECIALIZATION':
      return { ...state, selectedSpecialization: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_DOCTOR_AVAILABILITY':
      return {
        ...state,
        doctors: state.doctors.map(doctor =>
          doctor.id === action.payload.doctorId
            ? { ...doctor, availability: action.payload.availability }
            : doctor
        )
      };
    case 'UPDATE_APPOINTMENT_STATUS':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.appointmentId
            ? { ...appointment, status: action.payload.status }
            : appointment
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const bookAppointment = (doctorId: string, formData: BookingFormData): string => {
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const appointment: Appointment = {
      id: appointmentId,
      doctorId,
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    return appointmentId;
  };

  const getFilteredDoctors = (): Doctor[] => {
    return state.doctors.filter(doctor => {
      const matchesSearch = state.searchTerm === '' || 
        doctor.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(state.searchTerm.toLowerCase());
      
      const matchesSpecialization = state.selectedSpecialization === '' || 
        doctor.specialization === state.selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });
  };

  const getAppointmentById = (appointmentId: string): Appointment | undefined => {
    return state.appointments.find(appointment => appointment.id === appointmentId);
  };

  const getDoctorById = (doctorId: string): Doctor | undefined => {
    return state.doctors.find(doctor => doctor.id === doctorId);
  };
  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      bookAppointment, 
      getFilteredDoctors, 
      getAppointmentById, 
      getDoctorById 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}