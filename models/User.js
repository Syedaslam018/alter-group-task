const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true, unique: true },
  topic: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
