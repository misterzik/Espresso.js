/*
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 *
 */

var config = (module.exports = {});

// Settings :: General's

config.env = "production";
config.hostname = "www.example.com";
config.port = "80";

// Settings :: MongoDB

config.mongo_isEnabled = false;
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || "localhost";
config.mongo.port = "27017";
config.mongo.db = "clients";

// Settings :: SWAPI Sample

config.swapi_isEnabled = false;
config.swapi = {};
config.swapi.uri = "https://swapi.dev/api/people/";
config.swapi.configs = {
  method: "GET",
  url: "",
  headers: {
    "Content-Type": "application/json",
  },
};
