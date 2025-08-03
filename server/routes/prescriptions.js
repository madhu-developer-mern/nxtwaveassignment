const express = require('express');
const {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  updatePrescription
} = require('../controllers/prescriptionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Doctor routes
router.post('/', authenticateToken, authorizeRole(['doctor']), createPrescription);
router.put('/:id', authenticateToken, authorizeRole(['doctor']), updatePrescription);

// Patient routes
router.get('/patient/list', authenticateToken, authorizeRole(['patient']), getPatientPrescriptions);

// Shared routes
router.get('/:id', authenticateToken, getPrescriptionById);

module.exports = router;