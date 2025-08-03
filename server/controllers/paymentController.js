const Payment = require('../models/Payment');
const { appointments } = require('./appointmentController');
const { doctors } = require('./authController');

// In-memory storage
let payments = [];

const createPayment = async (req, res) => {
  try {
    const { 
      appointmentId, 
      paymentMethod = 'card',
      cardDetails,
      billingAddress 
    } = req.body;

    // Find appointment
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Find doctor to get consultation fee
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if payment already exists
    const existingPayment = payments.find(p => p.appointmentId === appointmentId);
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({ error: 'Payment already completed for this appointment' });
    }

    const amount = doctor.consultationFee;
    const processingFee = Math.round(amount * 0.029 + 0.30); // 2.9% + $0.30
    const netAmount = amount - processingFee;

    const payment = new Payment({
      appointmentId,
      patientId: req.user.userId,
      doctorId: appointment.doctorId,
      amount,
      paymentMethod,
      cardDetails: cardDetails ? {
        last4: cardDetails.cardNumber?.slice(-4) || '',
        brand: 'visa', // This would come from payment processor
        expiryMonth: cardDetails.expiryDate?.split('/')[0] || '',
        expiryYear: cardDetails.expiryDate?.split('/')[1] || ''
      } : null,
      billingAddress,
      processingFee,
      netAmount
    });

    // Simulate payment processing
    const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate

    if (isPaymentSuccessful) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payment.markAsCompleted(transactionId);
      
      // Update appointment status
      const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
      if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = 'confirmed';
        appointments[appointmentIndex].paymentId = payment.id;
        appointments[appointmentIndex].paymentStatus = 'completed';
        appointments[appointmentIndex].updatedAt = new Date().toISOString();
      }
    } else {
      payment.markAsFailed('Payment declined by bank');
    }

    payments.push(payment);

    res.json({
      message: payment.status === 'completed' ? 'Payment processed successfully' : 'Payment failed',
      payment,
      appointment: appointments.find(apt => apt.id === appointmentId)
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = payments.find(p => p.id === id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user has access to this payment
    if (payment.patientId !== req.user.userId && 
        payment.doctorId !== req.user.userId && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to retrieve payment' });
  }
};

const getPatientPayments = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const patientPayments = payments.filter(p => p.patientId === patientId);

    // Include appointment and doctor information
    const paymentsWithDetails = patientPayments.map(payment => {
      const appointment = appointments.find(apt => apt.id === payment.appointmentId);
      const doctor = doctors.find(d => d.id === payment.doctorId);
      
      return {
        ...payment,
        appointment,
        doctor: doctor ? doctor.toJSON() : null
      };
    });

    res.json(paymentsWithDetails);
  } catch (error) {
    console.error('Get patient payments error:', error);
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
};

const getDoctorPayments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const doctorPayments = payments.filter(p => p.doctorId === doctorId);

    // Include appointment information
    const paymentsWithAppointments = doctorPayments.map(payment => {
      const appointment = appointments.find(apt => apt.id === payment.appointmentId);
      return {
        ...payment,
        appointment
      };
    });

    res.json(paymentsWithAppointments);
  } catch (error) {
    console.error('Get doctor payments error:', error);
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const paymentIndex = payments.findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = payments[paymentIndex];
    
    // Validate refund amount
    if (amount > payment.amount) {
      return res.status(400).json({ error: 'Refund amount cannot exceed payment amount' });
    }

    payment.processRefund(amount, reason);
    payments[paymentIndex] = payment;

    res.json({
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
};

module.exports = {
  createPayment,
  getPaymentById,
  getPatientPayments,
  getDoctorPayments,
  refundPayment,
  payments
};