/**
 * EspressoJS - Modern Express Boilerplate
 * Your ultimate Express configuration starting point
 * 
 * This demo shows how to use the new APIManager for multiple API endpoints
 */
require("@misterzik/espressojs");
const express = require("express");
const router = express.Router();
const { apiManager } = require("@misterzik/espressojs");
const { asyncHandler } = require("@misterzik/espressojs/server/middleware/errorHandler");

// Example: Using the new APIManager
router.get("/v2/", asyncHandler(async (req, res) => {
  // Make a request using the configured API endpoint
  const data = await apiManager.request('api', '');
  res.json({
    status: 'success',
    data
  });
}));

// Example: Custom endpoint with parameters
router.get("/v2/people/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await apiManager.request('api', `${id}/`);
  res.json({
    status: 'success',
    data
  });
}));

// Example: Check API health
router.get("/v2/health", (req, res) => {
  const apis = apiManager.getAllAPIs();
  res.json({
    status: 'ok',
    apis: Object.keys(apis),
    version: '3.3.5'
  });
});

module.exports = router;
