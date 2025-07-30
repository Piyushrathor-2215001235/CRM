const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Email', 'SMS', 'Social'], required: true },
  targetAudience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['Scheduled', 'Active', 'Completed'], default: 'Scheduled' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metrics: {
    openRate: Number,
    conversionRate: Number,
    reach: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema); 