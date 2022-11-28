/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso 
 * Production Template
 */
require("dotenv").config();
const fs = require("fs");
const configBuffer = fs.readFileSync("./config.json"),
  data = JSON.parse(configBuffer.toString());
const config = () => {
  return {
    env: data.instance || "production",
    hostname: data.hostname || "www.example.com",
    port: data.instance || "80",
    mongo_isEnabled: data.mongoDB || false,
    mongo: {
      uri: process.env.MONGO_URI || "localhost",
      port: process.env.MONGO_URI_PORT || "27017",
      db: process.env.MONGO_URI_DB || "clients",
    },
    swapi_isEnabled: data.API || false,
    swapi: {
      uri: process.env.API_URI || "https://swapi.dev/api/people/",
      configs: {
        method: process.env.API_METHOD || "GET",
        url: process.env.API_OBJ_URL || "",
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
  };
};
module.exports = config;
