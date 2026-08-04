# EspressoJS Plugin Guide

## Overview

EspressoJS v5.0.0 introduces a powerful plugin architecture that allows you to extend the framework with custom functionality while keeping the core lightweight and flexible.

## Built-in Plugins

### 1. MongoDB Plugin

**Installation:**
```bash
npm install mongoose
```

**Configuration:**
```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "port": null,
    "instance": "database"
  }
}
```

**Environment Variables:**
```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
```

**Usage:**
```javascript
const { plugins } = require('@misterzik/espressojs');

// Access mongoose instance
const mongoose = app.locals.mongodb.mongoose;

// Create models
const User = mongoose.model('User', userSchema);
```

**Programmatic Usage:**
```javascript
await plugins.mongodb.initialize(app, {
  enabled: true,
  uri: 'cluster.mongodb.net',
  instance: 'mydb'
});

// Close connection
await plugins.mongodb.close();
```

---

### 2. Rate Limiting Plugin

**Installation:**
```bash
npm install express-rate-limit
```

**Configuration:**
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "global": true,
      "windowMs": 900000,
      "max": 100,
      "limiters": {
        "api": {
          "windowMs": 900000,
          "max": 200
        },
        "strict": {
          "windowMs": 60000,
          "max": 5
        }
      }
    }
  }
}
```

**Usage:**
```javascript
const { plugins } = require('@misterzik/espressojs');

// Get specific limiter
const apiLimiter = plugins.rateLimit.getLimiter('api');
app.use('/api', apiLimiter);

// Create custom limiter
const customLimiter = plugins.rateLimit.createLimiter({
  windowMs: 60000,
  max: 10,
  message: 'Too many requests'
});
app.use('/custom', customLimiter);
```

---

### 3. Security Plugin

**Installation:**
```bash
npm install hpp express-mongo-sanitize
```

**Configuration:**
```json
{
  "security": {
    "hpp": true,
    "mongoSanitize": true,
    "hppWhitelist": ["filter", "sort"]
  }
}
```

**Features:**
- **HPP Protection:** Prevents HTTP Parameter Pollution attacks
- **NoSQL Injection Prevention:** Sanitizes user input to prevent NoSQL injection

**Usage:**
```javascript
// Automatically applied based on configuration
// No manual setup required
```

---

### 4. SSR Plugin

**Installation:**
```bash
# Choose one or more template engines
npm install ejs
npm install pug
npm install handlebars
```

**Configuration:**
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": true,
      "staticGeneration": true,
      "helpers": {}
    }
  }
}
```

**Usage:**

**Rendering Views:**
```javascript
app.get('/', (req, res) => {
  res.renderView('index', {
    title: 'Home Page',
    data: myData
  });
});
```

**Static Site Generation:**
```javascript
const { plugins } = require('@misterzik/espressojs');

// Generate single page
await plugins.ssr.generateStaticFile('index', 'dist/index.html', {
  title: 'Home',
  data: homeData
});

// Generate multiple pages
const pages = [
  { view: 'index', output: 'dist/index.html', data: homeData },
  { view: 'about', output: 'dist/about.html', data: aboutData },
  { view: 'contact', output: 'dist/contact.html', data: contactData }
];

const results = await plugins.ssr.generateStaticSite(pages);
console.log(`Generated ${results.filter(r => r.success).length} pages`);
```

**Custom Helpers:**
```javascript
// config.json
{
  "features": {
    "ssr": {
      "enabled": true,
      "helpers": {
        "uppercase": "(str) => str.toUpperCase()",
        "formatCurrency": "(amount) => `$${amount.toFixed(2)}`"
      }
    }
  }
}
```

---

### 5. API Plugin

**Installation:**
```bash
npm install swagger-jsdoc swagger-ui-express express-validator
```

**Configuration:**
```json
{
  "features": {
    "apiEnhancer": {
      "enabled": true,
      "versioning": true,
      "documentation": true,
      "prefix": "/api",
      "version": "v1",
      "title": "My API",
      "description": "API documentation",
      "contact": {
        "name": "API Support",
        "email": "support@example.com"
      }
    }
  }
}
```

**Response Formatters:**
```javascript
app.get('/api/users', (req, res) => {
  // Success response
  res.success(users, 'Users retrieved successfully');
  
  // Error response
  res.error('User not found', 404);
  
  // Paginated response
  res.paginate(users, page, limit, total);
});
```

**API Versioning:**
```javascript
app.get('/api/users', (req, res) => {
  const version = req.apiVersion; // From header or query
  
  if (version === 'v1') {
    // v1 logic
  } else if (version === 'v2') {
    // v2 logic
  }
});
```

**Validation:**
```javascript
const { body } = require('express-validator');
const { plugins } = require('@misterzik/espressojs');

app.post('/api/users',
  [
    body('email').isEmail(),
    body('name').notEmpty()
  ],
  plugins.api.validationMiddleware(),
  (req, res) => {
    // Validation passed
    res.success({ message: 'User created' });
  }
);
```

**API Key Authentication:**
```javascript
const validKeys = ['key1', 'key2'];

app.get('/api/protected',
  plugins.api.apiKeyAuth(validKeys),
  (req, res) => {
    res.success({ data: 'Protected data' });
  }
);
```

**Swagger Documentation:**
```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/api/users', (req, res) => {
  res.success(users);
});
```

Access documentation at: `http://localhost:8080/api/docs`

---

### 6. Static Files Plugin

**Installation:**
```bash
npm install serve-static serve-favicon
```

**Configuration:**
```json
{
  "publicDirectory": "/public",
  "staticFiles": {
    "maxAge": "1d",
    "etag": true,
    "extensions": ["html"]
  }
}
```

**Features:**
- Automatic favicon serving
- Optimized cache control for different file types
- Fallback to express.static if serve-static not installed

---

## Creating Custom Plugins

### Plugin Structure

```javascript
class MyPlugin {
  constructor() {
    this.enabled = false;
  }

  async initialize(app, config = {}) {
    if (!config.enabled) {
      logger.info('MyPlugin is disabled');
      return;
    }

    this.enabled = true;

    // Check for required dependencies
    const dependency = pluginManager.safeRequire('my-dependency');
    if (!dependency) {
      logger.warn('my-dependency not installed');
      return;
    }

    // Add middleware
    app.use((req, res, next) => {
      req.myFeature = true;
      next();
    });

    // Store plugin data on app
    app.locals.myPlugin = {
      version: '1.0.0',
      enabled: true
    };

    logger.info('MyPlugin initialized');
  }

  // Custom methods
  myMethod() {
    return 'Hello from MyPlugin';
  }
}

module.exports = new MyPlugin();
```

### Registering Custom Plugins

```javascript
const { pluginManager } = require('@misterzik/espressojs');
const myPlugin = require('./plugins/my-plugin');

// Register plugin
pluginManager.register('myPlugin', myPlugin);

// Initialize plugin
await pluginManager.initialize('myPlugin', app, {
  enabled: true,
  option1: 'value1'
});

// Use plugin
const result = myPlugin.myMethod();
```

### Plugin Best Practices

1. **Check for dependencies:**
```javascript
const dependency = pluginManager.safeRequire('dependency-name');
if (!dependency) {
  logger.warn('Dependency not installed');
  return;
}
```

2. **Provide configuration options:**
```javascript
async initialize(app, config = {}) {
  this.enabled = config.enabled !== false;
  this.option1 = config.option1 || 'default';
}
```

3. **Store data on app.locals:**
```javascript
app.locals.myPlugin = {
  data: myData,
  methods: myMethods
};
```

4. **Log initialization:**
```javascript
logger.info('MyPlugin initialized');
logger.warn('MyPlugin: dependency not found');
logger.error('MyPlugin: initialization failed');
```

5. **Handle cleanup:**
```javascript
async close() {
  // Cleanup resources
  if (this.connection) {
    await this.connection.close();
  }
}
```

## Plugin Manager API

### Check Module Availability

```javascript
const { pluginManager } = require('@misterzik/espressojs');

if (pluginManager.isAvailable('mongoose')) {
  console.log('MongoDB support available');
}
```

### Safe Require

```javascript
// Returns null if not available
const redis = pluginManager.safeRequire('redis');

// Throws error if not available
const required = pluginManager.safeRequire('required-module', true);
```

### Register Plugin

```javascript
pluginManager.register('myPlugin', myPluginInstance);
```

### Initialize Plugin

```javascript
await pluginManager.initialize('myPlugin', app, config);
```

### Initialize All Plugins

```javascript
const results = await pluginManager.initializeAll(app, {
  plugin1: { enabled: true },
  plugin2: { enabled: false }
});
```

### Get Plugin

```javascript
const plugin = pluginManager.get('myPlugin');
```

### Check Plugin Registration

```javascript
if (pluginManager.has('myPlugin')) {
  console.log('Plugin is registered');
}
```

### List All Plugins

```javascript
const plugins = pluginManager.list();
console.log('Registered plugins:', plugins);
```

### Unregister Plugin

```javascript
pluginManager.unregister('myPlugin');
```

## Example: Redis Cache Plugin

```javascript
const logger = require('../utils/logger');
const pluginManager = require('../core/PluginManager');

class RedisCachePlugin {
  constructor() {
    this.redis = null;
    this.client = null;
  }

  async initialize(app, config = {}) {
    if (!config.enabled) {
      logger.info('Redis cache plugin is disabled');
      return;
    }

    this.redis = pluginManager.safeRequire('redis', true);

    this.client = this.redis.createClient({
      host: config.host || 'localhost',
      port: config.port || 6379,
      password: config.password || process.env.REDIS_PASSWORD
    });

    await this.client.connect();

    app.locals.cache = {
      get: async (key) => await this.client.get(key),
      set: async (key, value, ttl = 3600) => {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      },
      del: async (key) => await this.client.del(key)
    };

    logger.info('Redis cache plugin initialized');
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis connection closed');
    }
  }
}

module.exports = new RedisCachePlugin();
```

**Usage:**
```javascript
const redisPlugin = require('./plugins/redis.plugin');
const { pluginManager } = require('@misterzik/espressojs');

pluginManager.register('redis', redisPlugin);
await pluginManager.initialize('redis', app, {
  enabled: true,
  host: 'localhost',
  port: 6379
});

// Use in routes
app.get('/api/data', async (req, res) => {
  const cached = await app.locals.cache.get('data');
  if (cached) {
    return res.success(JSON.parse(cached));
  }

  const data = await fetchData();
  await app.locals.cache.set('data', data, 3600);
  res.success(data);
});
```

## Conclusion

The plugin architecture in EspressoJS v5.0.0 provides:
- ✅ Complete flexibility
- ✅ Minimal dependencies
- ✅ Easy extensibility
- ✅ Better performance
- ✅ Cleaner codebase

Create your own plugins to extend EspressoJS with any functionality you need!
