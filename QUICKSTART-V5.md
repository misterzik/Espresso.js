# EspressoJS v5.0.0 Quick Start Guide

## 🚀 Installation

### Minimal Installation (Core Only)
```bash
npm install @misterzik/espressojs
```

### Full Installation (All Features)
```bash
npm install @misterzik/espressojs --include=optional
```

### Custom Installation (Pick What You Need)
```bash
# Core framework
npm install @misterzik/espressojs

# Add MongoDB support
npm install mongoose

# Add SSR with EJS
npm install ejs

# Add rate limiting
npm install express-rate-limit

# Add security enhancements
npm install hpp express-mongo-sanitize

# Add API documentation
npm install swagger-jsdoc swagger-ui-express
```

## ⚡ Quick Setup

### 1. Create Basic Server

**index.js:**
```javascript
require('@misterzik/espressojs');
```

**cli.js:**
```javascript
require('@misterzik/espressojs/cli');
```

### 2. Initialize Configuration
```bash
node cli init
```

### 3. Run Server
```bash
node cli run
# or
npm start
```

## 🔌 Plugin Usage

### Access Built-in Plugins
```javascript
const { plugins, pluginManager } = require('@misterzik/espressojs');

// MongoDB Plugin
const mongoPlugin = plugins.mongodb;

// SSR Plugin
const ssrPlugin = plugins.ssr;

// API Plugin
const apiPlugin = plugins.api;

// Rate Limit Plugin
const rateLimitPlugin = plugins.rateLimit;
```

### Check Module Availability
```javascript
if (pluginManager.isAvailable('mongoose')) {
  console.log('MongoDB support available');
}

// Safe require (won't throw error)
const redis = pluginManager.safeRequire('redis');
```

## 🎨 Server-Side Rendering

### Configuration (config.json)
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": true,
      "staticGeneration": true
    }
  }
}
```

### Render Views
```javascript
app.get('/', (req, res) => {
  res.renderView('index', {
    title: 'Home Page',
    data: myData
  });
});
```

### Generate Static HTML
```javascript
const { plugins } = require('@misterzik/espressojs');

// Single page
await plugins.ssr.generateStaticFile('index', 'dist/index.html', {
  title: 'Home',
  content: 'Welcome'
});

// Multiple pages
await plugins.ssr.generateStaticSite([
  { view: 'index', output: 'dist/index.html', data: homeData },
  { view: 'about', output: 'dist/about.html', data: aboutData }
]);
```

## 🚀 API Features

### Configuration
```json
{
  "features": {
    "apiEnhancer": {
      "enabled": true,
      "documentation": true,
      "versioning": true,
      "prefix": "/api",
      "version": "v1"
    }
  }
}
```

### Response Formatters
```javascript
// Success response
app.get('/api/users', (req, res) => {
  res.success(users, 'Users retrieved');
});

// Error response
app.get('/api/error', (req, res) => {
  res.error('Not found', 404);
});

// Paginated response
app.get('/api/posts', (req, res) => {
  res.paginate(posts, page, limit, total);
});
```

### API Documentation
Access Swagger UI at: `http://localhost:8080/api/docs`

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/api/users', (req, res) => {
  res.success(users);
});
```

## 🔒 Security Features

### Configuration
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "global": true,
      "max": 100,
      "limiters": {
        "api": { "max": 200 },
        "strict": { "max": 10 }
      }
    },
    "hpp": true,
    "mongoSanitize": true
  }
}
```

### Custom Rate Limiting
```javascript
const { plugins } = require('@misterzik/espressojs');

// Get specific limiter
const apiLimiter = plugins.rateLimit.getLimiter('api');
app.use('/api', apiLimiter);

// Create custom limiter
const customLimiter = plugins.rateLimit.createLimiter({
  windowMs: 60000,
  max: 5
});
app.use('/custom', customLimiter);
```

## 💾 MongoDB Integration

### Configuration
```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "instance": "myDatabase"
  }
}
```

### Environment Variables (.env)
```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
```

### Usage
```javascript
// Access mongoose from app.locals
const mongoose = app.locals.mongodb.mongoose;

// Create models
const User = mongoose.model('User', userSchema);
```

## 🛠️ Custom Plugins

### Create Plugin
```javascript
const myPlugin = {
  async initialize(app, config) {
    if (!config.enabled) return;

    // Add middleware
    app.use((req, res, next) => {
      req.myFeature = true;
      next();
    });

    // Store data
    app.locals.myPlugin = {
      version: '1.0.0'
    };
  }
};
```

### Register and Use
```javascript
const { pluginManager } = require('@misterzik/espressojs');

pluginManager.register('myPlugin', myPlugin);
await pluginManager.initialize('myPlugin', app, { enabled: true });
```

## 📝 Common Patterns

### API with MongoDB
```javascript
const express = require('express');
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const User = app.locals.mongodb.mongoose.model('User');
    const users = await User.find();
    res.success(users);
  } catch (error) {
    res.error(error.message, 500);
  }
});

module.exports = router;
```

### SSR with Data Fetching
```javascript
app.get('/blog/:slug', async (req, res) => {
  const post = await fetchPost(req.params.slug);
  
  if (!post) {
    return res.status(404).renderView('404');
  }
  
  res.renderView('blog-post', {
    title: post.title,
    post: post
  });
});
```

### Cached API Endpoint
```javascript
app.get('/api/data', async (req, res) => {
  // Check cache (if using custom cache plugin)
  const cached = app.locals.cache?.get('data');
  if (cached) {
    return res.success(cached, 'From cache');
  }

  // Fetch fresh data
  const data = await fetchData();
  
  // Store in cache
  app.locals.cache?.set('data', data, 3600);
  
  res.success(data);
});
```

## 🔧 CLI Commands

```bash
# Initialize configuration
node cli init

# Run server
node cli run

# Show current config
node cli show

# Validate configuration
node cli validate

# Set environment
node cli env --instance=production --port=80

# Show version
node cli version
```

## 📦 NPM Scripts

```json
{
  "scripts": {
    "start": "node cli run",
    "dev": "node cli env --instance=development --port=8080 && node cli run",
    "dev:watch": "nodemon cli run",
    "prod": "node cli env --instance=production --port=80 && node cli run"
  }
}
```

## 🆘 Troubleshooting

### Module Not Found Errors
```bash
# Install the missing optional dependency
npm install <module-name>

# Examples:
npm install mongoose        # For MongoDB
npm install ejs            # For SSR
npm install express-rate-limit  # For rate limiting
```

### Check What's Installed
```javascript
const { pluginManager } = require('@misterzik/espressojs');

console.log('Mongoose:', pluginManager.isAvailable('mongoose'));
console.log('EJS:', pluginManager.isAvailable('ejs'));
console.log('Rate Limit:', pluginManager.isAvailable('express-rate-limit'));
```

## 📚 Documentation

- **Full Documentation:** [README.md](./README.md)
- **Migration Guide:** [MIGRATION-V5.md](./MIGRATION-V5.md)
- **Plugin Guide:** [docs/PLUGIN-GUIDE.md](./docs/PLUGIN-GUIDE.md)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

## 🎯 Next Steps

1. **Explore Examples:** Check the `examples/` directory
2. **Read Plugin Guide:** Learn to create custom plugins
3. **Configure Security:** Set up rate limiting and security features
4. **Add MongoDB:** If you need database support
5. **Enable SSR:** For server-side rendering or static sites
6. **API Documentation:** Enable Swagger for your API

## 💡 Tips

- Install only the dependencies you need
- Use `--include=optional` for full feature set
- Check module availability before using features
- Use plugins for extensibility
- Leverage static site generation for performance
- Enable caching in production

Happy coding with EspressoJS v5.0.0! ☕
