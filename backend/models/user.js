const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true }, // For users
  policeId: { type: String, unique: true, sparse: true }, // For admins
  password: { type: String, required: true }, // Hashed password for both
  policeIdPhoto: { type: String }, // Path to uploaded photo for admins
  adminKey: { type: String, unique: true, sparse: true }, // Unique key for admins
  role: { type: String, enum: ['user', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);