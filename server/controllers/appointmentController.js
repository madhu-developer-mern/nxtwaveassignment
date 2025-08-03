const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const { doctors } = require('./authController');

// In-memory storage
let appointments = [];

const createAppointment = async (req, res) => {
  try {
    const { 
      doctorId, 
      appointmentDate, 
      appointmentTime, 
      patientName, 
      patientEmail,
      patientPhone,
      symptoms,
      type = 'consultation'
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime || !patientName || !patientEmail) {
      return res.status(400).json({ 
        error: 'Doctor ID, appointment date, time, patient name, and email are required' 
      });
    }

    // Check if doctor exists
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if time slot is available
    if (!doctor.availableSlots.includes(appointmentTime)) {
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }

    // Check for existing appointment at the same time
    const existingAppointment = appointments.find(apt => 
      apt.doctorId === doctorId && 
      apt.appointmentDate === appointmentDate && 
      apt.appointmentTime === appointmentTime &&
      apt.status !== 'cancelled'
    );

    if (existingAppointment) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      doctorId,
      patientId: req.user?.userId || null,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      symptoms,
      type
    });

    appointments.push(appointment);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    res.json({ 
      appointment, 
      doctor: doctor ? doctor.toJSON() : null 
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to retrieve appointment' });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const patientAppointments = appointments.filter(apt => 
      apt.patientId === patientId || apt.patientEmail === req.user.email
    );

    // Include doctor information
    const appointmentsWithDoctors = patientAppointments.map(apt => {
      const doctor = doctors.find(d => d.id === apt.doctorId);
      return {
        ...apt,
        doctor: doctor ? doctor.toJSON() : null
      };
    });

    res.json(appointmentsWithDoctors);
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);

    res.json(doctorAppointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, diagnosis, prescription } = req.body;
    const doctorId = req.user.userId;

    const appointmentIndex = appointments.findIndex(apt => 
      apt.id === id && apt.doctorId === doctorId
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointments[appointmentIndex];
    appointment.updateStatus(status);

    if (notes) appointment.notes = notes;
    if (diagnosis) appointment.addDiagnosis(diagnosis);
    if (prescription) appointment.addPrescription(prescription);

    appointments[appointmentIndex] = appointment;

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const appointmentIndex = appointments.findIndex(apt => 
      apt.id === id && (apt.doctorId === userId || apt.patientId === userId)
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointments[appointmentIndex];
    appointment.updateStatus('cancelled');
    appointment.notes = `Cancelled: ${reason || 'No reason provided'}`;

    appointments[appointmentIndex] = appointment;

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);
    
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      totalAppointments: doctorAppointments.length,
      todayAppointments: doctorAppointments.filter(apt => 
        apt.appointmentDate === today
      ).length,
      pendingAppointments: doctorAppointments.filter(apt => apt.status === 'pending').length,
      confirmedAppointments: doctorAppointments.filter(apt => apt.status === 'confirmed').length,
      completedAppointments: doctorAppointments.filter(apt => apt.status === 'completed').length,
      cancelledAppointments: doctorAppointments.filter(apt => apt.status === 'cancelled').length
    };

    const recentAppointments = doctorAppointments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const upcomingAppointments = doctorAppointments
      .filter(apt => 
        apt.status === 'confirmed' && 
        new Date(apt.appointmentDate) >= new Date(today)
      )
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 5);

    res.json({
      stats,
      recentAppointments,
      upcomingAppointments
    });
  } catch (error) {
    console.error('Get doctor dashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getDoctorDashboard,
  appointments
};