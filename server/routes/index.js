/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * Client Model
 * ----
 * @param {*} app - Vimedev.com Labs
 */

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;