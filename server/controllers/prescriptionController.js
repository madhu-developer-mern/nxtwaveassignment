const Prescription = require('../models/Prescription');
const { appointments } = require('./appointmentController');

// In-memory storage
let prescriptions = [];

const createPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      medications,
      instructions,
      diagnosis,
      symptoms,
      vitalSigns,
      labTests,
      followUpInstructions
    } = req.body;

    const doctorId = req.user.userId;

    // Validate appointment exists and belongs to doctor
    const appointment = appointments.find(apt => 
      apt.id === appointmentId && apt.doctorId === doctorId
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const prescription = new Prescription({
      appointmentId,
      doctorId,
      patientId: appointment.patientId,
      medications: medications || [],
      instructions,
      diagnosis,
      symptoms,
      vitalSigns,
      labTests: labTests || [],
      followUpInstructions
    });

    prescriptions.push(prescription);

    // Update appointment with prescription
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
      appointments[appointmentIndex].prescription = prescription.id;
      appointments[appointmentIndex].diagnosis = diagnosis;
      appointments[appointmentIndex].updatedAt = new Date().toISOString();
    }

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Check access permissions
    if (prescription.patientId !== req.user.userId && 
        prescription.doctorId !== req.user.userId && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ error: 'Failed to retrieve prescription' });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId);

    res.json(patientPrescriptions);
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ error: 'Failed to retrieve prescriptions' });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const doctorId = req.user.userId;

    const prescriptionIndex = prescriptions.findIndex(p => 
      p.id === id && p.doctorId === doctorId
    );

    if (prescriptionIndex === -1) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const prescription = prescriptions[prescriptionIndex];
    
    // Update allowed fields
    if (updates.medications) prescription.medications = updates.medications;
    if (updates.instructions) prescription.instructions = updates.instructions;
    if (updates.diagnosis) prescription.diagnosis = updates.diagnosis;
    if (updates.symptoms) prescription.symptoms = updates.symptoms;
    if (updates.vitalSigns) prescription.vitalSigns = updates.vitalSigns;
    if (updates.labTests) prescription.labTests = updates.labTests;
    if (updates.followUpInstructions) prescription.followUpInstructions = updates.followUpInstructions;
    if (updates.status) prescription.status = updates.status;

    prescription.updatedAt = new Date().toISOString();
    prescriptions[prescriptionIndex] = prescription;

    res.json({
      message: 'Prescription updated successfully',
      prescription
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  updatePrescription,
  prescriptions
};