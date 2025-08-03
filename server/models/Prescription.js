const { v4: uuidv4 } = require('uuid');

class Prescription {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.appointmentId = data.appointmentId;
    this.doctorId = data.doctorId;
    this.patientId = data.patientId;
    this.medications = data.medications || []; // Array of medication objects
    this.instructions = data.instructions || '';
    this.diagnosis = data.diagnosis || '';
    this.symptoms = data.symptoms || '';
    this.vitalSigns = data.vitalSigns || {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    };
    this.labTests = data.labTests || [];
    this.followUpInstructions = data.followUpInstructions || '';
    this.nextAppointment = data.nextAppointment || null;
    this.status = data.status || 'active'; // active, completed, cancelled
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  addMedication(medication) {
    this.medications.push({
      id: uuidv4(),
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      duration: medication.duration,
      instructions: medication.instructions || '',
      addedAt: new Date().toISOString()
    });
    this.updatedAt = new Date().toISOString();
  }

  removeMedication(medicationId) {
    this.medications = this.medications.filter(med => med.id !== medicationId);
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Prescription;