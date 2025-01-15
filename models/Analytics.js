const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  alias: { type: String, required: true },
  timestamp: { type: Date, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  country: { type: String },
  region: { type: String },
  city: { type: String },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
