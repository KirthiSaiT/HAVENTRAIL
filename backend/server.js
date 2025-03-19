const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://kirthisai251:6ZbpO3QOxvRi1pZg@haven.hn2zp.mongodb.net/?retryWrites=true&w=majority&appName=Haven', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('uploads'));

// Routes
app.use('/auth', authRoutes);

// Sample Crime Endpoint (optional)
app.get('/api/crimes', (req, res) => {
  const crimes = [{ lat: 13.0827, lng: 80.2707, type: 'Theft', timestamp: new Date() }];
  res.json(crimes);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));