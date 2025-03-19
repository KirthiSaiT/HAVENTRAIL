const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who reported it
  type: { type: String, required: true }, // e.g., "Theft", "Assault"
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Crime', crimeSchema);