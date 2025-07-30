const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stages: [{ type: String }],
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Pipeline', pipelineSchema); 