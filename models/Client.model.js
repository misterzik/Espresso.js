/**
 * Client Model
 * Vimedev.com Labs
 * ----------------
 * This will be were you would build the schema for
 * your own database, for this example, i have a database
 * name clients with collections in it for testing purposes,
 * with the following fields
 * name: "Test",
 * email: "test@local"
 * location "NJ"
 * -----------------
 * Make sure to change this to fit your needs.
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