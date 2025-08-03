import { Doctor } from '../types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'available',
    rating: 4.9,
    experience: 12,
    education: 'MD, Harvard Medical School',
    location: 'Downtown Medical Center',
    about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and advanced cardiac procedures.',
    consultationFee: 150,
    availableSlots: ['09:00', '10:30', '14:00', '15:30', '16:30']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Pediatrician',
    profileImage: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'available',
    rating: 4.8,
    experience: 8,
    education: 'MD, Johns Hopkins University',
    location: 'Children\'s Health Clinic',
    about: 'Dr. Michael Chen is a dedicated pediatrician focused on providing comprehensive care for children from infancy through adolescence. He has a special interest in developmental pediatrics.',
    consultationFee: 120,
    availableSlots: ['08:30', '10:00', '11:30', '14:30', '16:00']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'busy',
    rating: 4.7,
    experience: 10,
    education: 'MD, Stanford Medical School',
    location: 'Skin Care Institute',
    about: 'Dr. Emily Rodriguez is a renowned dermatologist specializing in both medical and cosmetic dermatology. She is experienced in treating various skin conditions and aesthetic procedures.',
    consultationFee: 180,
    availableSlots: ['13:00', '15:00']
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    profileImage: 'https://images.pexels.com/photos/6129591/pexels-photo-6129591.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'available',
    rating: 4.9,
    experience: 15,
    education: 'MD, Mayo Medical School',
    location: 'Orthopedic Surgery Center',
    about: 'Dr. James Wilson is a highly skilled orthopedic surgeon with extensive experience in joint replacement, sports medicine, and trauma surgery. He is committed to helping patients regain mobility and quality of life.',
    consultationFee: 200,
    availableSlots: ['09:30', '11:00', '13:30', '15:00']
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialization: 'Gynecologist',
    profileImage: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'available',
    rating: 4.8,
    experience: 11,
    education: 'MD, UCLA Medical School',
    location: 'Women\'s Health Center',
    about: 'Dr. Lisa Thompson is a compassionate gynecologist dedicated to women\'s health and wellness. She provides comprehensive care including preventive services, pregnancy care, and treatment of gynecological conditions.',
    consultationFee: 160,
    availableSlots: ['08:00', '09:30', '14:00', '16:30']
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    specialization: 'Neurologist',
    profileImage: 'https://images.pexels.com/photos/5452207/pexels-photo-5452207.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: 'unavailable',
    rating: 4.9,
    experience: 14,
    education: 'MD, PhD, Columbia University',
    location: 'Neurology Institute',
    about: 'Dr. Robert Kim is a leading neurologist specializing in the diagnosis and treatment of neurological disorders. His expertise includes epilepsy, stroke, and neurodegenerative diseases.',
    consultationFee: 220,
    availableSlots: []
  }
];