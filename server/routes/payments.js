const express = require('express');
const {
  createPayment,
  getPaymentById,
  getPatientPayments,
  getDoctorPayments,
  refundPayment
} = require('../controllers/paymentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Patient routes
router.post('/', authenticateToken, createPayment);
router.get('/patient/list', authenticateToken, authorizeRole(['patient']), getPatientPayments);

// Doctor routes
router.get('/doctor/list', authenticateToken, authorizeRole(['doctor']), getDoctorPayments);

// Shared routes
router.get('/:id', authenticateToken, getPaymentById);

// Admin routes
router.post('/:id/refund', authenticateToken, authorizeRole(['admin']), refundPayment);

module.exports = router;