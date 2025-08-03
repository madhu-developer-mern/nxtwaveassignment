const express = require('express');
const {
  createAppointment,
  getAppointmentById,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getDoctorDashboard
} = require('../controllers/appointmentController');
const { authenticateToken, authorizeRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/:id', optionalAuth, getAppointmentById);

// Patient routes
router.post('/', authenticateToken, createAppointment);
router.get('/patient/list', authenticateToken, authorizeRole(['patient']), getPatientAppointments);

// Doctor routes
router.get('/doctor/list', authenticateToken, authorizeRole(['doctor']), getDoctorAppointments);
router.get('/doctor/dashboard', authenticateToken, authorizeRole(['doctor']), getDoctorDashboard);
router.put('/doctor/:id', authenticateToken, authorizeRole(['doctor']), updateAppointmentStatus);

// Shared routes (patient and doctor can cancel)
router.put('/:id/cancel', authenticateToken, cancelAppointment);

module.exports = router;