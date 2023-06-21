/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - API Routers
 */

const express = require("express");
const router = express.Router();
const configuration = require("../../server");

// const { getAPI, getItem, getItemId } = require("../utils");
// router.get("/v1/", (req, res) => {
//   getAPI(req, res);
// });
// router.get("/v1/:item", (req, res, next) => {
//   getItem(req, res, req.params.item);
// });
// router.get("/v1/:item/:itemId", (req, res, next) => {
//   getItemId(req, res, req.params.item, req.params.itemId);
// });

module.exports = { router, configuration };
