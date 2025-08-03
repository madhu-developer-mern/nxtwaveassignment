const { v4: uuidv4 } = require('uuid');

class Payment {
  constructor(data) {
    this.id = data.id || `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.appointmentId = data.appointmentId;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.amount = data.amount;
    this.currency = data.currency || 'USD';
    this.paymentMethod = data.paymentMethod; // card, cash, insurance
    this.paymentIntentId = data.paymentIntentId || null; // For Stripe integration
    this.status = data.status || 'pending'; // pending, completed, failed, refunded
    this.transactionId = data.transactionId || null;
    this.cardDetails = data.cardDetails || null;
    this.billingAddress = data.billingAddress || null;
    this.refundAmount = data.refundAmount || 0;
    this.refundReason = data.refundReason || '';
    this.processingFee = data.processingFee || 0;
    this.netAmount = data.netAmount || data.amount;
    this.paymentDate = data.paymentDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  markAsCompleted(transactionId) {
    this.status = 'completed';
    this.transactionId = transactionId;
    this.paymentDate = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  markAsFailed(reason) {
    this.status = 'failed';
    this.failureReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  processRefund(amount, reason) {
    this.refundAmount = amount;
    this.refundReason = reason;
    this.status = 'refunded';
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Payment;