const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role || 'patient';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.dateOfBirth = data.dateOfBirth || '';
    this.gender = data.gender || '';
    this.emergencyContact = data.emergencyContact || '';
    this.medicalHistory = data.medicalHistory || [];
    this.allergies = data.allergies || [];
    this.currentMedications = data.currentMedications || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;