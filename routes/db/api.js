/**
 * Client Model
 * Vimedev.com Labs
 * ----------------
 * Static IndexApi
 * ----------------- 
 * Vimedev.com Labs
 */
const express = require('express');
const router = express.Router();

router.get('/v1', (req, res) => {
    res.json({ "message": "Welcome to Espresso Plug-n-Play. Static Message with Space to Grow." });
});

module.exports = router;