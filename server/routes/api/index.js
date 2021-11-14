/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * API Routers
 * ---
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ "message": "Welcome to Espresso JS Plug-n-Play." });
});

module.exports = router;