/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso 
 * Dev Template
 */
require("dotenv").config();
const fs = require("fs");
const configBuffer = fs.readFileSync("./config.json"),
  data = JSON.parse(configBuffer.toString());

const config = () => {
  return {
    env: data.instance || "development",
    hostname: data.hostname || "dev.example.com",
    port: data.instance || "8080",
    mongo_isEnabled: data.mongoDB || true,
    mongo: {
      uri: process.env.MONGO_URI || "localhost",
      port: process.env.MONGO_URI_PORT || "27017",
      db: process.env.MONGO_URI_DB || "myFirstDatabase",
    },
    swapi_isEnabled: data.API || true,
    swapi: {
      uri: process.env.API_URI || "https://swapi.dev/api/people/",
      configs: {
        method: process.env.API_METHOD ||"GET",
        url: process.env.API_OBJ_URL || "",
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
  };
};
module.exports = config;

