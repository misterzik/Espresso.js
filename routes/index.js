/**
 * Client Model
 * Vimedev.com Labs
 * ----------------
 * Router Path-Ways Export All
 * -----------------
 * @param {*} app - Vimedev.com Labs
 */

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;