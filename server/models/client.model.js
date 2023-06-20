/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * MongoDB Schema Clients Sample
 */
const mongoose = require("mongoose");
const clientSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    location: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("clients", clientSchema);
