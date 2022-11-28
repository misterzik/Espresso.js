/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso 
 * Global Template w/ API
 */
require("dotenv").config();
const fs = require("fs");
const configBuffer = fs.readFileSync("./config.json"),
  data = JSON.parse(configBuffer.toString());
const config = () => {
  return {
    env: data.instance || "development",
    hostname: data.hostname || "global.example.com",
    port: data.instance || "8080",
    mongo_isEnabled: data.mongoDB || false,
    mongo: {
      uri: process.env.MONGO_URI || "localhost",
      port: process.env.MONGO_URI_PORT || "",
      db: process.env.MONGO_URI_DB || "",
    },
    swapi_isEnabled: data.API ? data.API : true || true,
    swapi: {
      uri: process.env.API_URI || "https://swapi.dev/api/",
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
