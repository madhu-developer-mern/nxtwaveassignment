const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class Doctor {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = 'doctor';
    this.specialization = data.specialization;
    this.licenseNumber = data.licenseNumber || '';
    this.experience = data.experience || 0;
    this.education = data.education || '';
    this.location = data.location || '';
    this.about = data.about || '';
    this.consultationFee = data.consultationFee || 0;
    this.profileImage = data.profileImage || '';
    this.availability = data.availability || 'available';
    this.rating = data.rating || 0;
    this.totalRatings = data.totalRatings || 0;
    this.availableSlots = data.availableSlots || [];
    this.workingHours = data.workingHours || {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    };
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.isVerified = data.isVerified || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  updateRating(newRating) {
    const totalScore = this.rating * this.totalRatings + newRating;
    this.totalRatings += 1;
    this.rating = Math.round((totalScore / this.totalRatings) * 10) / 10;
  }

  toJSON() {
    const { password, ...doctorWithoutPassword } = this;
    return doctorWithoutPassword;
  }
}

module.exports = Doctor;