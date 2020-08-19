/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * Client Model
 * ---
 *
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ "message": "Welcome to EspressoJS Plug-n-Play. Static Message with Space to Grow." });
});

module.exports = router;