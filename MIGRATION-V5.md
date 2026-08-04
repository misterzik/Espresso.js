# Migration Guide: v4.x to v5.0.0

## Overview

EspressoJS v5.0.0 introduces a **plugin-based architecture** that makes the framework truly flexible and non-opinionated. This is a **major breaking change** that requires migration steps.

## 🎯 Key Changes

### 1. **Plugin Architecture**
All optional features (MongoDB, SSR, Rate Limiting, etc.) are now plugins that can be installed and enabled independently.

### 2. **Optional Dependencies**
Previously required packages are now optional. Install only what you need:
- MongoDB support: `npm install mongoose`
- SSR support: `npm install ejs` or `npm install pug` or `npm install handlebars`
- Rate limiting: `npm install express-rate-limit`
- Security enhancements: `npm install hpp express-mongo-sanitize`
- API documentation: `npm install swagger-jsdoc swagger-ui-express`
- Validation: `npm install express-validator`
- Static files: `npm install serve-static serve-favicon`

### 3. **Package Updates**
- Updated to latest secure versions of all dependencies
- Removed deprecated `always-auth` from .npmrc
- Added proper peer dependencies for optional packages

## 📦 Breaking Changes

### Dependencies Structure

**Before (v4.x):**
```json
{
  "dependencies": {
    "mongoose": "^8.8.3",
    "ejs": "^3.1.10",
    "express-rate-limit": "^7.4.1",
    // ... all packages required
  }
}
```

**After (v5.0.0):**
```json
{
  "dependencies": {
    "express": "^4.21.1",
    "helmet": "^8.3.0",
    // ... only core packages
  },
  "optionalDependencies": {
    "mongoose": "^8.24.2",
    "ejs": "^3.1.10",
    // ... optional packages
  }
}
```

### Configuration Changes

**Before (v4.x):**
```javascript
const app = require('@misterzik/espressojs');
const { ssrManager, apiEnhancer } = app;
```

**After (v5.0.0):**
```javascript
const app = require('@misterzik/espressojs');
const { plugins, pluginManager } = app;

// Access plugins
const ssrPlugin = plugins.ssr;
const apiPlugin = plugins.api;
```

### SSR Changes

**Before (v4.x):**
```javascript
const { createSSRManager } = require('@misterzik/espressojs/server/middleware/ssr');
const ssrManager = createSSRManager(config);
ssrManager.initialize(app);
```

**After (v5.0.0):**
```javascript
const { plugins } = require('@misterzik/espressojs');

// SSR is automatically initialized based on config
// Access via plugins.ssr for static generation
await plugins.ssr.generateStaticFile('index', 'dist/index.html', data);
```

### API Enhancement Changes

**Before (v4.x):**
```javascript
const { createAPIEnhancer } = require('@misterzik/espressojs/server/middleware/apiEnhancer');
const apiEnhancer = createAPIEnhancer(config);
apiEnhancer.setupSwagger(app);
```

**After (v5.0.0):**
```javascript
// API enhancement is automatically initialized based on config
// No manual setup required
```

## 🚀 Migration Steps

### Step 1: Update Package Version

```bash
npm install @misterzik/espressojs@5.0.0
```

### Step 2: Install Optional Dependencies

Install only the packages you need:

```bash
# For MongoDB support
npm install mongoose

# For SSR with EJS
npm install ejs

# For rate limiting
npm install express-rate-limit

# For enhanced security
npm install hpp express-mongo-sanitize

# For API documentation
npm install swagger-jsdoc swagger-ui-express

# For request validation
npm install express-validator

# For static file serving (optional, express.static is used as fallback)
npm install serve-static serve-favicon
```

### Step 3: Update Configuration

Your `config.json` structure remains mostly the same, but you can now disable features without errors:

```json
{
  "instance": "development",
  "port": 8080,
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "staticGeneration": true
    },
    "apiEnhancer": {
      "enabled": true,
      "documentation": true
    }
  },
  "security": {
    "rateLimit": {
      "enabled": true,
      "global": true
    },
    "hpp": true,
    "mongoSanitize": true
  },
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "instance": "database"
  }
}
```

### Step 4: Update Code (if using programmatically)

**Before:**
```javascript
const app = require('@misterzik/espressojs');
const { ssrManager, apiEnhancer } = app;

// Use managers directly
ssrManager.render('view', data);
```

**After:**
```javascript
const app = require('@misterzik/espressojs');
const { plugins } = app;

// Use plugins
await plugins.ssr.generateStatic('view', data);
```

### Step 5: Update Custom Middleware

If you were using security middleware directly:

**Before:**
```javascript
const { rateLimiter, hppProtection } = require('@misterzik/espressojs/server/middleware/security');
app.use(rateLimiter);
```

**After:**
```javascript
const { plugins } = require('@misterzik/espressojs');

// Access rate limiter from plugin
const limiter = plugins.rateLimit.getLimiter('default');
app.use(limiter);
```

## 🆕 New Features in v5.0.0

### 1. Static Site Generation

```javascript
const { plugins } = require('@misterzik/espressojs');

// Generate single static page
await plugins.ssr.generateStaticFile('index', 'dist/index.html', {
  title: 'Home Page',
  data: myData
});

// Generate multiple pages
await plugins.ssr.generateStaticSite([
  { view: 'index', output: 'dist/index.html', data: homeData },
  { view: 'about', output: 'dist/about.html', data: aboutData },
]);
```

### 2. Plugin Manager

```javascript
const { pluginManager } = require('@misterzik/espressojs');

// Check if a module is available
if (pluginManager.isAvailable('mongoose')) {
  console.log('MongoDB support available');
}

// Safely require optional modules
const redis = pluginManager.safeRequire('redis');
if (redis) {
  // Use redis
}
```

### 3. Custom Plugins

Create your own plugins:

```javascript
const { pluginManager } = require('@misterzik/espressojs');

const myPlugin = {
  async initialize(app, config) {
    // Plugin initialization logic
    app.use((req, res, next) => {
      req.myFeature = true;
      next();
    });
  }
};

pluginManager.register('myPlugin', myPlugin);
await pluginManager.initialize('myPlugin', app, config);
```

### 4. Enhanced Rate Limiting

```javascript
// config.json
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
          "windowMs": 900000,
          "max": 10
        }
      }
    }
  }
}
```

```javascript
// Use custom limiters
const { plugins } = require('@misterzik/espressojs');
const apiLimiter = plugins.rateLimit.getLimiter('api');
app.use('/api', apiLimiter);
```

## ⚠️ Deprecations

### Removed in v5.0.0

1. **Direct middleware exports** - Use plugins instead
2. **createSSRManager** - SSR is now a plugin
3. **createAPIEnhancer** - API enhancement is now a plugin
4. **Hard-coded dependencies** - All optional features require explicit installation

### Deprecated (will be removed in v6.0.0)

1. **Old security middleware imports** - Use security plugin
2. **Direct mongoose usage** - Use MongoDB plugin

## 🐛 Bug Fixes

1. Fixed `.npmrc` warning about deprecated `always-auth` config
2. Fixed hard-coded dependencies causing installation issues
3. Fixed cache control issues with static files
4. Improved error handling for missing optional dependencies
5. Better graceful shutdown handling

## 📊 Performance Improvements

1. Faster startup time (only loads required plugins)
2. Smaller package size (optional dependencies not bundled)
3. Better memory usage (plugins loaded on-demand)
4. Improved caching strategies

## 🔒 Security Enhancements

1. Updated all dependencies to latest secure versions
2. Optional security features (install only what you need)
3. Better NoSQL injection prevention
4. Enhanced HPP protection
5. Improved CSP configuration

## 📚 Documentation Updates

- New plugin architecture guide
- Updated API documentation
- Enhanced examples for common use cases
- Better TypeScript definitions (coming soon)

## 🆘 Troubleshooting

### Issue: "Cannot find module 'mongoose'"

**Solution:** Install mongoose if you're using MongoDB:
```bash
npm install mongoose
```

### Issue: "Cannot find module 'ejs'"

**Solution:** Install your preferred template engine:
```bash
npm install ejs
# or
npm install pug
# or
npm install handlebars
```

### Issue: Rate limiting not working

**Solution:** Install express-rate-limit:
```bash
npm install express-rate-limit
```

### Issue: Swagger documentation not showing

**Solution:** Install swagger dependencies:
```bash
npm install swagger-jsdoc swagger-ui-express
```

## 📞 Support

- GitHub Issues: https://github.com/misterzik/Espresso.js/issues
- Documentation: https://github.com/misterzik/Espresso.js#readme
- NPM Package: https://www.npmjs.com/package/@misterzik/espressojs

## 🎉 Conclusion

v5.0.0 makes EspressoJS truly flexible and non-opinionated. You now have complete control over which features to use and which dependencies to install. This reduces package size, improves performance, and makes the framework easier to customize.

Happy coding! ☕
