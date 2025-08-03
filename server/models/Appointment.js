const { v4: uuidv4 } = require('uuid');

class Appointment {
  constructor(data) {
    this.id = data.id || `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.doctorId = data.doctorId;
    this.patientId = data.patientId;
    this.patientName = data.patientName;
    this.patientEmail = data.patientEmail;
    this.patientPhone = data.patientPhone || '';
    this.appointmentDate = data.appointmentDate;
    this.appointmentTime = data.appointmentTime;
    this.duration = data.duration || 30; // minutes
    this.type = data.type || 'consultation'; // consultation, follow-up, emergency
    this.status = data.status || 'pending'; // pending, confirmed, completed, cancelled, no-show
    this.symptoms = data.symptoms || '';
    this.notes = data.notes || '';
    this.prescription = data.prescription || null;
    this.diagnosis = data.diagnosis || '';
    this.followUpRequired = data.followUpRequired || false;
    this.followUpDate = data.followUpDate || null;
    this.paymentId = data.paymentId || null;
    this.paymentStatus = data.paymentStatus || 'pending';
    this.reminderSent = data.reminderSent || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }

  addPrescription(prescription) {
    this.prescription = prescription;
    this.updatedAt = new Date().toISOString();
  }

  addDiagnosis(diagnosis) {
    this.diagnosis = diagnosis;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Appointment;