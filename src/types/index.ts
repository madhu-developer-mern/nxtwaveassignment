export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  experience: number;
  education: string;
  location: string;
  about: string;
  consultationFee: number;
  availableSlots: string[];
  email?: string;
  role?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
  paymentId?: string;
  notes?: string;
}

export interface BookingFormData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentTimeline {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'patient' | 'doctor';
  specialization?: string;
  experience?: number;
  education?: string;
  location?: string;
  about?: string;
  consultationFee?: number;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}