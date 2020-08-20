/*
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * 
 */

var config = module.exports = {};

// Settings :: General's

config.env = 'development';
config.hostname = 'dev.example.com';
config.port = '8080'

// Settings :: MongoDB
config.mongo_isEnabled = false
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'localhost';
config.mongo.port = ''
config.mongo.db = '';