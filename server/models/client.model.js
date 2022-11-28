/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * MongoDB Schema Example
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
