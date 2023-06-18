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
const { readConfigFile } = require("../utils/config.utils");
const data = readConfigFile();

const config = {
  env: data.instance || "global",
  hostname: data.hostname || "example.com",
  port: data.port || "8080",
  mongo_isEnabled:
    data.mongoDB.enabled !== undefined ? data.mongoDB.enabled : false,
  mongo: {
    uri: data.mongoDB.uri || "localhost",
    port: data.mongoDB.port || "27017",
    db: data.mongoDB.instance || "myFirstDatabase",
  },
  api_isEnabled: data.api.enabled !== undefined ? data.api.enabled : false,
  api: {
    uri: data.api.uri || "https://swapi.dev/api/people/",
    configs: {
      method: data.api.method || "GET",
      url: data.api.url || "",
      headers: data.api.headers,
    },
  },
};
module.exports = config;
