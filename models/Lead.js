const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  source: String,
  status: { type: String, enum: ['New', 'Contacted', 'Negotiated', 'Converted', 'Lost'], default: 'New' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema); 