/*
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * Configuration workflow
 */
const fs = require("fs");

require("dotenv").config();
const configBuffer = fs.readFileSync("./config.json"),
  dataJSON = configBuffer.toString(),
  data = JSON.parse(dataJSON);

const env = data.instance || process.env.NODE_ENV || "development";
const cfg = require("./config/config." + env);

module.exports = cfg;
