const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let users = [];
let doctors = [];
let appointments = [];
let payments = [];

// Initialize with some sample data
const initializeData = () => {
  // Sample doctors
  doctors = [
    {
      id: '1',
      email: 'sarah.johnson@hospital.com',
      password: bcrypt.hashSync('doctor123', 10),
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: 'available',
      rating: 4.9,
      experience: 12,
      education: 'MD, Harvard Medical School',
      location: 'Downtown Medical Center',
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience.',
      consultationFee: 150,
      availableSlots: ['09:00', '10:30', '14:00', '15:30', '16:30'],
      role: 'doctor'
    },
    {
      id: '2',
      email: 'michael.chen@hospital.com',
      password: bcrypt.hashSync('doctor123', 10),
      name: 'Dr. Michael Chen',
      specialization: 'Pediatrician',
      profileImage: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: 'available',
      rating: 4.8,
      experience: 8,
      education: 'MD, Johns Hopkins University',
      location: 'Children\'s Health Clinic',
      about: 'Dr. Michael Chen is a dedicated pediatrician focused on providing comprehensive care.',
      consultationFee: 120,
      availableSlots: ['08:30', '10:00', '11:30', '14:30', '16:00'],
      role: 'doctor'
    }
  ];

  // Sample admin
  users.push({
    id: 'admin1',
    email: 'admin@doctoronCall.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'System Administrator',
    role: 'admin'
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check role
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'patient', ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email) || 
                        doctors.find(d => d.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const userData = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    if (role === 'doctor') {
      const doctorData = {
        ...userData,
        ...additionalData,
        availability: 'available',
        rating: 0,
        availableSlots: []
      };
      doctors.push(doctorData);
    } else {
      users.push(userData);
    }

    const token = jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email, name, role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in both users and doctors arrays
    let user = users.find(u => u.email === email) || 
               doctors.find(d => d.email === email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  // Find user details
  let user = users.find(u => u.id === req.user.userId) || 
             doctors.find(d => d.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Doctor Routes
app.get('/api/doctors', (req, res) => {
  const publicDoctors = doctors.map(doctor => {
    const { password, ...publicData } = doctor;
    return publicData;
  });
  res.json(publicDoctors);
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  
  const { password, ...publicData } = doctor;
  res.json(publicData);
});

// Doctor Dashboard Routes
app.get('/api/doctor/dashboard', authenticateToken, authorizeRole(['doctor']), (req, res) => {
  const doctorAppointments = appointments.filter(apt => apt.doctorId === req.user.userId);
  
  const stats = {
    totalAppointments: doctorAppointments.length,
    todayAppointments: doctorAppointments.filter(apt => 
      new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
    ).length,
    pendingAppointments: doctorAppointments.filter(apt => apt.status === 'pending').length,
    completedAppointments: doctorAppointments.filter(apt => apt.status === 'completed').length
  };

  res.json({
    stats,
    recentAppointments: doctorAppointments.slice(0, 5)
  });
});

app.get('/api/doctor/appointments', authenticateToken, authorizeRole(['doctor']), (req, res) => {
  const doctorAppointments = appointments.filter(apt => apt.doctorId === req.user.userId);
  res.json(doctorAppointments);
});

app.put('/api/doctor/appointments/:id', authenticateToken, authorizeRole(['doctor']), (req, res) => {
  const { status } = req.body;
  const appointmentIndex = appointments.findIndex(apt => 
    apt.id === req.params.id && apt.doctorId === req.user.userId
  );

  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  appointments[appointmentIndex].status = status;
  appointments[appointmentIndex].updatedAt = new Date().toISOString();

  res.json(appointments[appointmentIndex]);
});

// Appointment Routes
app.post('/api/appointments', authenticateToken, (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, patientName, patientEmail } = req.body;

    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment = {
      id: appointmentId,
      doctorId,
      patientId: req.user.userId,
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    appointments.push(appointment);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.get('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(apt => apt.id === req.params.id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  res.json({ appointment, doctor });
});

app.get('/api/patient/appointments', authenticateToken, authorizeRole(['patient']), (req, res) => {
  const patientAppointments = appointments.filter(apt => apt.patientId === req.user.userId);
  res.json(patientAppointments);
});

// Payment Routes
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { appointmentId, amount, paymentMethod } = req.body;

    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = {
      id: paymentId,
      appointmentId,
      patientId: req.user.userId,
      amount,
      paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    payments.push(payment);

    // Update appointment status
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    appointments[appointmentIndex].status = 'confirmed';
    appointments[appointmentIndex].paymentId = paymentId;

    res.json({
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Admin Routes
app.get('/api/admin/dashboard', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const stats = {
    totalDoctors: doctors.length,
    totalPatients: users.filter(u => u.role === 'patient').length,
    totalAppointments: appointments.length,
    totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0)
  };

  res.json({
    stats,
    recentAppointments: appointments.slice(-10),
    recentDoctors: doctors.slice(-5)
  });
});

app.get('/api/admin/doctors', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json(doctors);
});

app.get('/api/admin/patients', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const patients = users.filter(u => u.role === 'patient');
  res.json(patients);
});

app.get('/api/admin/appointments', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json(appointments);
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});