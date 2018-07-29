/**
 * Client Model
 * Insanen.com Labs
 */

const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  name: String,
  email: String,
  location: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Client', ClientSchema);