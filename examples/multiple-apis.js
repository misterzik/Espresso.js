/*
 * EspressoJS - Multiple API Endpoints Example
 * This example demonstrates how to use multiple API configurations
 */

const express = require('express');
const router = express.Router();
const { asyncHandler, AppError } = require('../server/middleware/errorHandler');
const { apiManager } = require('../index');

// Example 1: Using the API Manager directly
router.get('/news', asyncHandler(async (req, res) => {
  // Make a request to api2 endpoint
  const newsData = await apiManager.request('api2', '');
  
  res.status(200).json({
    status: 'success',
    source: 'api2',
    data: newsData
  });
}));

// Example 2: Using multiple APIs in a single endpoint
router.get('/combined-data', asyncHandler(async (req, res) => {
  // Check which APIs are available
  const availableAPIs = apiManager.getAllAPIs();
  
  // Make parallel requests to multiple APIs
  const results = await Promise.allSettled([
    apiManager.request('api', '/endpoint1'),
    apiManager.request('api2', ''),
    apiManager.request('api3', '/data')
  ]);
  
  const data = {
    api1: results[0].status === 'fulfilled' ? results[0].value : null,
    api2: results[1].status === 'fulfilled' ? results[1].value : null,
    api3: results[2].status === 'fulfilled' ? results[2].value : null,
  };
  
  res.status(200).json({
    status: 'success',
    availableAPIs: Object.keys(availableAPIs),
    data
  });
}));

// Example 3: Using specific API with custom options
router.get('/custom-request', asyncHandler(async (req, res) => {
  const data = await apiManager.request('api3', '/custom-endpoint', {
    method: 'POST',
    data: { query: 'example' },
    headers: {
      'Custom-Header': 'value'
    },
    timeout: 5000,
    retries: 2
  });
  
  res.status(200).json({
    status: 'success',
    data
  });
}));

// Example 4: Creating a custom Axios instance for an API
router.get('/axios-instance', asyncHandler(async (req, res) => {
  // Create a custom axios instance for api2
  const api2Client = apiManager.createAxiosInstance('api2');
  
  // Use it like regular axios
  const response = await api2Client.get('/specific-endpoint');
  
  res.status(200).json({
    status: 'success',
    data: response.data
  });
}));

// Example 5: Conditional API usage based on availability
router.get('/smart-fetch', asyncHandler(async (req, res) => {
  let data;
  
  // Try primary API first, fallback to secondary
  if (apiManager.hasAPI('api')) {
    try {
      data = await apiManager.request('api', '/data');
    } catch (error) {
      // Fallback to api3 if api fails
      if (apiManager.hasAPI('api3')) {
        data = await apiManager.request('api3', '/data');
      } else {
        throw new AppError('No API endpoints available', 503);
      }
    }
  } else if (apiManager.hasAPI('api3')) {
    data = await apiManager.request('api3', '/data');
  } else {
    throw new AppError('No API endpoints configured', 503);
  }
  
  res.status(200).json({
    status: 'success',
    data
  });
}));

// Example 6: List all configured APIs
router.get('/api-info', (req, res) => {
  const apis = apiManager.getAllAPIs();
  
  const apiInfo = Object.entries(apis).map(([name, config]) => ({
    name,
    baseURL: config.baseURL,
    method: config.method,
    timeout: config.timeout,
    retries: config.retries
  }));
  
  res.status(200).json({
    status: 'success',
    count: apiInfo.length,
    apis: apiInfo
  });
});

// Example 7: Proxy endpoint for any API
router.get('/proxy/:apiName/*', asyncHandler(async (req, res) => {
  const { apiName } = req.params;
  const endpoint = req.params[0];
  
  if (!apiManager.hasAPI(apiName)) {
    throw new AppError(`API '${apiName}' not found`, 404);
  }
  
  const data = await apiManager.request(apiName, `/${endpoint}`, {
    method: req.method,
    params: req.query
  });
  
  res.status(200).json({
    status: 'success',
    api: apiName,
    endpoint,
    data
  });
}));

module.exports = router;
