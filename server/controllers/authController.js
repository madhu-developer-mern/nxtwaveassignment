const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory storage (replace with database in production)
let users = [];
let doctors = [];

// Initialize with sample data
const initializeUsers = () => {
  // Sample admin user
  users.push(new User({
    id: 'admin1',
    email: 'admin@doctoronCall.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    name: 'System Administrator',
    role: 'admin'
  }));

  // Sample patient
  users.push(new User({
    id: 'patient1',
    email: 'patient@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: patient123
    name: 'John Doe',
    role: 'patient',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    gender: 'male'
  }));

  // Sample doctors
  doctors.push(new Doctor({
    id: '1',
    email: 'sarah.johnson@hospital.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: doctor123
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    experience: 12,
    education: 'MD, Harvard Medical School',
    location: 'Downtown Medical Center',
    about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience.',
    consultationFee: 150,
    availableSlots: ['09:00', '10:30', '14:00', '15:30', '16:30'],
    rating: 4.9,
    phone: '+1 (555) 234-5678',
    licenseNumber: 'MD12345',
    isVerified: true
  }));

  doctors.push(new Doctor({
    id: '2',
    email: 'michael.chen@hospital.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: doctor123
    name: 'Dr. Michael Chen',
    specialization: 'Pediatrician',
    profileImage: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400',
    experience: 8,
    education: 'MD, Johns Hopkins University',
    location: 'Children\'s Health Clinic',
    about: 'Dr. Michael Chen is a dedicated pediatrician focused on providing comprehensive care.',
    consultationFee: 120,
    availableSlots: ['08:30', '10:00', '11:30', '14:30', '16:00'],
    rating: 4.8,
    phone: '+1 (555) 345-6789',
    licenseNumber: 'MD23456',
    isVerified: true
  }));
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const findUserByEmail = (email) => {
  const user = users.find(u => u.email === email);
  if (user) return { user, type: 'user' };
  
  const doctor = doctors.find(d => d.email === email);
  if (doctor) return { user: doctor, type: 'doctor' };
  
  return null;
};

const register = async (req, res) => {
  try {
    const { email, password, name, role = 'patient', ...additionalData } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await User.hashPassword(password);

    let newUser;
    if (role === 'doctor') {
      // Validate doctor-specific fields
      if (!additionalData.specialization || !additionalData.licenseNumber) {
        return res.status(400).json({ 
          error: 'Specialization and license number are required for doctors' 
        });
      }

      newUser = new Doctor({
        email,
        password: hashedPassword,
        name,
        ...additionalData
      });
      doctors.push(newUser);
    } else {
      newUser = new User({
        email,
        password: hashedPassword,
        name,
        role,
        ...additionalData
      });
      users.push(newUser);
    }

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = findUserByEmail(email);
    if (!userResult) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const { user } = userResult;
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const verifyToken = async (req, res) => {
  try {
    const userResult = findUserByEmail(req.user.email);
    if (!userResult) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: userResult.user.toJSON()
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    const userResult = findUserByEmail(req.user.email);
    if (!userResult) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { user } = userResult;
    const isValidPassword = await User.comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await User.hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Initialize data
initializeUsers();

module.exports = {
  register,
  login,
  verifyToken,
  changePassword,
  users,
  doctors
};