/*
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * Configuration workflow
 */

const env = process.env.NODE_ENV || 'development'
const cfg = require('./config/config.' + env);

module.exports = cfg;