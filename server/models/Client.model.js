/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * This will be were you would build the schema for
 * your own database.
 * 
 * For this example: 
 * We have a document by the name of 'clients' 
 * with collections in it. The fields are has follow:
 * 
 * name: "John Doe",
 * email: "john@doe"
 * location "Earth"
 * ---
 */

const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: String,
    email: String,
    location: String
}, {
    timestamps: true
});

module.exports = mongoose.model('clients', ClientSchema);