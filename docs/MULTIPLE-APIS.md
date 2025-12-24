# Multiple API Endpoints Guide

EspressoJS supports configuring and using multiple API endpoints simultaneously. This guide shows you how to set up and use multiple APIs in your application.

## 📋 Configuration

### Basic Setup

In your `config.json`, you can define multiple API endpoints using the pattern `api`, `api2`, `api3`, etc.:

```json
{
  "instance": "production",
  "port": 3001,
  "hostname": "",
  "publicDirectory": "/public",
  "mongoDB": {
    "enabled": false
  },
  "api": {
    "enabled": true,
    "uri": "https://api.example.com/v1/",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    },
    "timeout": 30000,
    "retries": 2
  },
  "api2": {
    "enabled": true,
    "uri": "https://api.example.com/v1/news",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_TOKEN"
    },
    "timeout": 15000,
    "retries": 1
  },
  "api3": {
    "enabled": true,
    "uri": "https://api.example.com/api",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "X-Custom-Header": "value"
    }
  }
}
```

### Configuration Options

Each API endpoint supports the following options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `enabled` | boolean | No | `true` | Enable/disable this API endpoint |
| `uri` | string | Yes | `""` | Base URL for the API |
| `method` | string | No | `"GET"` | Default HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS) |
| `headers` | object | No | `{"Content-Type": "application/json"}` | Default headers for requests |
| `timeout` | number | No | `30000` | Request timeout in milliseconds |
| `retries` | number | No | `0` | Number of retry attempts on failure (0-5) |

## 🚀 Usage

### Method 1: Using the API Manager

The API Manager is automatically initialized and available in your routes:

```javascript
const { apiManager } = require('../index');

// Make a request to a specific API
router.get('/data', async (req, res) => {
  const data = await apiManager.request('api2', '/endpoint');
  res.json(data);
});
```

### Method 2: Multiple Parallel Requests

Fetch data from multiple APIs simultaneously:

```javascript
router.get('/combined', async (req, res) => {
  const [data1, data2, data3] = await Promise.all([
    apiManager.request('api', '/users'),
    apiManager.request('api2', '/news'),
    apiManager.request('api3', '/stats')
  ]);
  
  res.json({ data1, data2, data3 });
});
```

### Method 3: Custom Request Options

Override default configuration per request:

```javascript
router.post('/custom', async (req, res) => {
  const data = await apiManager.request('api', '/endpoint', {
    method: 'POST',
    data: req.body,
    headers: {
      'Custom-Header': 'value'
    },
    timeout: 5000,
    retries: 3
  });
  
  res.json(data);
});
```

### Method 4: Create Axios Instance

For more control, create a custom Axios instance:

```javascript
router.get('/advanced', async (req, res) => {
  const client = apiManager.createAxiosInstance('api2');
  
  // Use like regular axios
  const response = await client.get('/endpoint', {
    params: { page: 1, limit: 10 }
  });
  
  res.json(response.data);
});
```

## 🔍 API Manager Methods

### `request(apiName, endpoint, options)`

Make a request to a configured API endpoint.

**Parameters:**
- `apiName` (string): Name of the API (e.g., 'api', 'api2', 'api3')
- `endpoint` (string): Endpoint path to append to base URI
- `options` (object): Axios request options (optional)

**Returns:** Promise with response data

**Example:**
```javascript
const data = await apiManager.request('api2', '/users/123', {
  method: 'GET',
  headers: { 'X-Custom': 'value' }
});
```

### `getAPI(name)`

Get configuration for a specific API.

**Parameters:**
- `name` (string): API name (defaults to 'api')

**Returns:** API configuration object

**Example:**
```javascript
const apiConfig = apiManager.getAPI('api2');
console.log(apiConfig.baseURL); // https://api.example.com/v1/news
```

### `getAllAPIs()`

Get all configured API endpoints.

**Returns:** Object with all API configurations

**Example:**
```javascript
const allAPIs = apiManager.getAllAPIs();
console.log(Object.keys(allAPIs)); // ['api', 'api2', 'api3']
```

### `hasAPI(name)`

Check if an API is configured.

**Parameters:**
- `name` (string): API name to check

**Returns:** Boolean

**Example:**
```javascript
if (apiManager.hasAPI('api2')) {
  // Use api2
}
```

### `createAxiosInstance(apiName)`

Create a custom Axios instance for an API.

**Parameters:**
- `apiName` (string): Name of the API

**Returns:** Axios instance

**Example:**
```javascript
const client = apiManager.createAxiosInstance('api3');
const response = await client.post('/data', { key: 'value' });
```

## 💡 Common Patterns

### Fallback Pattern

Try primary API, fallback to secondary:

```javascript
router.get('/data', async (req, res) => {
  let data;
  
  try {
    data = await apiManager.request('api', '/data');
  } catch (error) {
    // Fallback to api2
    data = await apiManager.request('api2', '/data');
  }
  
  res.json(data);
});
```

### Conditional API Usage

Use different APIs based on conditions:

```javascript
router.get('/data/:type', async (req, res) => {
  const { type } = req.params;
  
  let apiName = 'api';
  if (type === 'news') apiName = 'api2';
  if (type === 'stats') apiName = 'api3';
  
  const data = await apiManager.request(apiName, '/data');
  res.json(data);
});
```

### Error Handling with Retries

The API Manager automatically retries failed requests based on the `retries` configuration:

```javascript
// This will retry up to 2 times with exponential backoff
const data = await apiManager.request('api', '/endpoint', {
  retries: 2
});
```

### Proxy Pattern

Create a proxy endpoint for any configured API:

```javascript
router.all('/proxy/:apiName/*', async (req, res) => {
  const { apiName } = req.params;
  const endpoint = req.params[0];
  
  if (!apiManager.hasAPI(apiName)) {
    return res.status(404).json({ error: 'API not found' });
  }
  
  const data = await apiManager.request(apiName, `/${endpoint}`, {
    method: req.method,
    data: req.body,
    params: req.query
  });
  
  res.json(data);
});
```

## 🔒 Security Best Practices

### 1. Use Environment Variables for Tokens

Store sensitive data in `.env`:

```env
API_TOKEN=your_secret_token
API2_KEY=another_secret_key
```

Reference in `config.json`:

```json
{
  "api2": {
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

Or set headers dynamically in your code:

```javascript
const data = await apiManager.request('api2', '/endpoint', {
  headers: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
});
```

### 2. Set Appropriate Timeouts

Configure timeouts to prevent hanging requests:

```json
{
  "api": {
    "timeout": 5000
  }
}
```

### 3. Limit Retries

Set reasonable retry limits to avoid overwhelming APIs:

```json
{
  "api": {
    "retries": 2
  }
}
```

## 📊 Monitoring

### Log API Requests

The API Manager automatically logs all requests:

```
[info]: API endpoint 'api2' loaded: https://api.example.com/v1/news
[debug]: API request to api2: GET https://api.example.com/v1/news/latest (attempt 1/1)
[info]: API api2 request successful: 200
```

### Track API Health

Create a health check endpoint:

```javascript
router.get('/api-health', async (req, res) => {
  const apis = apiManager.getAllAPIs();
  const health = {};
  
  for (const [name, config] of Object.entries(apis)) {
    try {
      await apiManager.request(name, '/health', { timeout: 5000 });
      health[name] = 'healthy';
    } catch (error) {
      health[name] = 'unhealthy';
    }
  }
  
  res.json({ status: 'ok', apis: health });
});
```

## 🎯 Real-World Example

Here's a complete example using the client's production configuration:

```javascript
const express = require('express');
const router = express.Router();
const { apiManager } = require('../index');
const { asyncHandler } = require('../server/middleware/errorHandler');

// Get exchange data from primary API
router.get('/exchange', asyncHandler(async (req, res) => {
  const data = await apiManager.request('api', '');
  res.json(data);
}));

// Get news from api2
router.get('/news', asyncHandler(async (req, res) => {
  const news = await apiManager.request('api2', '');
  res.json(news);
}));

// Get general API data from api3
router.get('/general', asyncHandler(async (req, res) => {
  const data = await apiManager.request('api3', '');
  res.json(data);
}));

// Combined dashboard data
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [exchange, news, general] = await Promise.allSettled([
    apiManager.request('api', ''),
    apiManager.request('api2', ''),
    apiManager.request('api3', '')
  ]);
  
  res.json({
    exchange: exchange.status === 'fulfilled' ? exchange.value : null,
    news: news.status === 'fulfilled' ? news.value : null,
    general: general.status === 'fulfilled' ? general.value : null
  });
}));

module.exports = router;
```

## 🆘 Troubleshooting

### API not found error

**Error:** `API 'api2' not found in configuration`

**Solution:** Ensure the API is defined in `config.json` and `enabled` is not set to `false`.

### Timeout errors

**Error:** Request timeout

**Solution:** Increase the `timeout` value in your API configuration or request options.

### Validation errors

**Error:** Configuration validation failed

**Solution:** Run `node cli validate` to check your configuration for errors.

## 📚 See Also

- [Basic API Example](../examples/basic-api.js)
- [Multiple APIs Example](../examples/multiple-apis.js)
- [Configuration Guide](../README.md#configuration)

---

**Need help?** Open an issue on [GitHub](https://github.com/misterzik/Espresso.js/issues)
