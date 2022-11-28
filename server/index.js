/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS
 */
const fs = require("fs");
require("dotenv").config();
const configBuffer = fs.readFileSync("./config.json"),
  data = JSON.parse(configBuffer.toString());
const env = data.instance || process.env.NODE_ENV || "development";
const cfg = require("./config/config." + env);
module.exports = cfg;
