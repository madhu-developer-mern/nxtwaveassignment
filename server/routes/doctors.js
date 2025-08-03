const express = require('express');
const { doctors } = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  try {
    const { specialization, availability, search } = req.query;
    
    let filteredDoctors = doctors.filter(doctor => doctor.isVerified);

    if (specialization) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    if (availability) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.availability === availability
      );
    }

    if (search) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
        doctor.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    const publicDoctors = filteredDoctors.map(doctor => doctor.toJSON());
    res.json(publicDoctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to retrieve doctors' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(doctor.toJSON());
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to retrieve doctor' });
  }
});

// Doctor routes
router.get('/profile/me', authenticateToken, authorizeRole(['doctor']), (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === req.user.userId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }
    
    res.json(doctor.toJSON());
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

router.put('/profile/me', authenticateToken, authorizeRole(['doctor']), (req, res) => {
  try {
    const doctorIndex = doctors.findIndex(d => d.id === req.user.userId);
    if (doctorIndex === -1) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const doctor = doctors[doctorIndex];
    const updates = req.body;

    // Update allowed fields
    if (updates.about) doctor.about = updates.about;
    if (updates.consultationFee) doctor.consultationFee = updates.consultationFee;
    if (updates.availableSlots) doctor.availableSlots = updates.availableSlots;
    if (updates.workingHours) doctor.workingHours = updates.workingHours;
    if (updates.phone) doctor.phone = updates.phone;
    if (updates.address) doctor.address = updates.address;
    if (updates.availability) doctor.availability = updates.availability;

    doctor.updatedAt = new Date().toISOString();
    doctors[doctorIndex] = doctor;

    res.json({
      message: 'Profile updated successfully',
      doctor: doctor.toJSON()
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;