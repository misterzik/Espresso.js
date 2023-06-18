/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS
 */
require("dotenv").config();
const { readConfigFile } = require("./utils/config.utils");
const data = readConfigFile();
const env = data.instance || "development";
const cfg = require("./config/" + env);
module.exports = cfg;
