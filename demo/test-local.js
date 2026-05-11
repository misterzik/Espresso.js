/**
 * EspressoJS v4.0.0 - Local Test Demo
 * 
 * This file starts the local development version of Espresso.js
 * Run: node demo/test-local.js
 */

console.log('\n🚀 Starting Espresso.js v4.0.0 (local development)...\n');

// Use local version (not npm package)
const { startServer, config } = require("../index");

// Start the server
startServer();

console.log('\n✅ Server started!');
console.log('📍 Visit: http://localhost:' + (config.port || 8080));
console.log('💚 Health: http://localhost:' + (config.port || 8080) + '/health');
console.log('📚 API Docs: http://localhost:' + (config.port || 8080) + '/api/docs');
console.log('\n✨ Press Ctrl+C to stop\n');
