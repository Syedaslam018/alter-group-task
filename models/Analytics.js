const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  alias: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  ipAddress: { type: String },
  osType: { type: String },
  deviceType: { type: String },
  location: { type: String },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
