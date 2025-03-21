const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/user');
const Crime = require('../models/crime');
const router = express.Router();

// Multer setup for file uploads (police ID photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, 'havenTrailSecret123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// User Registration (Email + Password)
router.post('/register/user', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      password: hashedPassword,
      role: 'user',
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, 'havenTrailSecret123', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(201).json({ message: 'User registered', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Registration (Police ID + Photo + Password)
router.post('/register/admin', upload.single('policeIdPhoto'), async (req, res) => {
  const { policeId, password } = req.body;
  const policeIdPhoto = req.file ? req.file.path : null;

  try {
    let user = await User.findOne({ policeId });
    if (user) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminKey = require('crypto').randomBytes(16).toString('hex');
    user = new User({
      policeId,
      password: hashedPassword,
      policeIdPhoto,
      adminKey,
      role: 'admin',
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, 'havenTrailSecret123', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(201).json({ message: 'Admin registered', adminKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login (Email + Password)
router.post('/login/user', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: 'user' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'havenTrailSecret123', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.json({ message: 'User logged in', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login (Police ID + Password)
router.post('/login/admin', async (req, res) => {
  const { policeId, password } = req.body;
  try {
    const user = await User.findOne({ policeId, role: 'admin' });
    if (!user) return res.status(401).json({ message: 'Invalid police ID or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid police ID or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'havenTrailSecret123', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.json({ message: 'Admin logged in', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile Route (Protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      email: user.email,
      policeId: user.policeId,
      role: user.role,
      adminKey: user.adminKey,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Report Crime (Users only)
router.post('/crime/report', verifyToken, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Admins cannot report crimes' });

  const { type, lat, lng } = req.body;
  try {
    const crime = new Crime({
      userId: req.user.id,
      type,
      lat,
      lng,
    });
    await crime.save();
    res.status(201).json({ message: 'Crime reported' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Crimes (Role-based)
router.get('/crimes', verifyToken, async (req, res) => {
  try {
    let crimes;
    if (req.user.role === 'user') {
      crimes = await Crime.find({ userId: req.user.id }); // Users see only their reports
    } else if (req.user.role === 'admin') {
      crimes = await Crime.find(); // Admins see all reports
    }
    res.json(crimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;