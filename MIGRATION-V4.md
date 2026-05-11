# Migration Guide: v3.x to v4.0.0

## Overview

Espresso.js v4.0.0 introduces significant enhancements while maintaining backward compatibility. This guide will help you migrate your existing applications and take advantage of new features.

## Breaking Changes

### 1. Node.js Version Requirement

**Before**: Node.js >= 0.10.0  
**After**: Node.js >= 18.0.0

**Action Required**: Update your Node.js installation

```bash
# Check current version
node --version

# Update to Node.js 18+ (using nvm)
nvm install 18
nvm use 18
```

### 2. Mongoose Connection Options

**Before**:
```javascript
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  promiseLibrary: require("bluebird"),
})
```

**After**:
```javascript
mongoose.connect(url)
```

**Action Required**: None if using Espresso.js directly. If you have custom Mongoose code, remove deprecated options.

### 3. Package Updates

Several packages have been updated to latest versions:

- Express: 4.18.2 → 4.21.1
- Axios: 1.6.5 → 1.7.7
- Mongoose: 8.0.4 → 8.8.3
- Helmet: 7.1.0 → 8.0.0
- Winston: 3.11.0 → 3.17.0

**Action Required**: Run `npm install` to update dependencies

## New Features

### 1. Server-Side Rendering (SSR)

**New Configuration**:
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": false,
      "layout": null
    }
  }
}
```

**Migration Steps**:

1. Create views directory:
```bash
mkdir views
```

2. Convert static HTML to templates:

**Before** (`public/index.html`):
```html
<!DOCTYPE html>
<html>
<head><title>My App</title></head>
<body>
    <h1>Welcome</h1>
</body>
</html>
```

**After** (`views/index.ejs`):
```html
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
    <h1>Welcome to <%= title %></h1>
</body>
</html>
```

3. Update routes:

**Before**:
```javascript
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**After**:
```javascript
app.get('/', (req, res) => {
  res.renderView('index', { title: 'My App' });
});
```

### 2. API Enhancements

**New Configuration**:
```json
{
  "features": {
    "apiEnhancer": {
      "enabled": true,
      "versioning": false,
      "documentation": true,
      "prefix": "/api",
      "version": "v1",
      "title": "My API",
      "description": "API documentation"
    }
  }
}
```

**Migration Steps**:

1. Update API responses:

**Before**:
```javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

**After**:
```javascript
app.get('/api/users', (req, res) => {
  res.success([], 'Users retrieved successfully');
});
```

2. Add Swagger documentation:

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
  res.success([], 'Users retrieved successfully');
});
```

### 3. Enhanced Security

**New Security Features**:
- HTTP Parameter Pollution (HPP) protection
- MongoDB sanitization
- Stricter CSP in production
- Request size limits

**Configuration**:
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 900000,
      "max": 100
    },
    "strictCSP": false
  }
}
```

**Migration Steps**:

No action required - security features are automatically enabled. To use strict CSP:

```json
{
  "security": {
    "strictCSP": true
  }
}
```

**Note**: Strict CSP removes `unsafe-inline` for scripts and styles. Ensure your frontend code doesn't rely on inline scripts.

## Configuration Updates

### Old Config Structure (v3.x)

```json
{
  "instance": "development",
  "port": 8080,
  "hostname": "",
  "publicDirectory": "/public",
  "mongoDB": {
    "enabled": false,
    "port": null,
    "uri": "",
    "instance": "database"
  },
  "api": {
    "enabled": false,
    "uri": "",
    "method": "GET",
    "headers": {},
    "timeout": 30000,
    "retries": 0
  }
}
```

### New Config Structure (v4.0.0)

```json
{
  "instance": "development",
  "port": 8080,
  "hostname": "",
  "publicDirectory": "/public",
  "features": {
    "ssr": {
      "enabled": false,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": false,
      "layout": null
    },
    "apiEnhancer": {
      "enabled": false,
      "versioning": false,
      "documentation": false,
      "prefix": "/api",
      "version": "v1",
      "title": "Espresso.js API",
      "description": "API documentation"
    }
  },
  "security": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 900000,
      "max": 100
    },
    "strictCSP": false
  },
  "mongoDB": {
    "enabled": false,
    "port": null,
    "uri": "",
    "instance": "database"
  },
  "api": {
    "enabled": false,
    "uri": "",
    "method": "GET",
    "headers": {},
    "timeout": 30000,
    "retries": 0
  }
}
```

**Backward Compatibility**: Old config structure still works! New features are opt-in.

## Step-by-Step Migration

### Step 1: Backup Your Project

```bash
git commit -am "Backup before v4 migration"
git tag v3-backup
```

### Step 2: Update package.json

```bash
npm install @misterzik/espressojs@4.0.0
```

### Step 3: Update Node.js

```bash
nvm install 18
nvm use 18
```

### Step 4: Update Dependencies

```bash
npm install
```

### Step 5: Update Configuration (Optional)

Add new features to `config.json`:

```json
{
  "features": {
    "ssr": {
      "enabled": false
    },
    "apiEnhancer": {
      "enabled": false,
      "documentation": false
    }
  },
  "security": {
    "rateLimit": {
      "enabled": true
    }
  }
}
```

### Step 6: Test Your Application

```bash
npm start
```

Check for:
- Server starts without errors
- All routes work as expected
- Database connections succeed
- API endpoints respond correctly

### Step 7: Enable New Features (Optional)

#### Enable SSR

1. Update config:
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs"
    }
  }
}
```

2. Create views directory and templates
3. Update routes to use `res.renderView()`

#### Enable API Documentation

1. Update config:
```json
{
  "features": {
    "apiEnhancer": {
      "enabled": true,
      "documentation": true
    }
  }
}
```

2. Add Swagger comments to routes
3. Visit `/api/docs` to see documentation

## Common Issues and Solutions

### Issue 1: Port Already in Use

**Error**: `Port 8080 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -i :8080
kill -9 <PID>

# Or change port in config.json
```

### Issue 2: MongoDB Connection Failed

**Error**: `DB Connection error: ...`

**Solution**:
- Check `.env` file has `MONGO_USER` and `MONGO_TOKEN`
- Verify MongoDB URI in `config.json`
- Ensure MongoDB credentials are URL-encoded (v4 does this automatically)

### Issue 3: Views Not Found

**Error**: `Failed to lookup view "index"`

**Solution**:
- Ensure `viewsDir` exists
- Check file extensions match engine (`.ejs`, `.hbs`, `.pug`)
- Verify SSR is enabled in config

### Issue 4: Swagger Docs Not Showing

**Error**: Blank page at `/api/docs`

**Solution**:
- Ensure `documentation: true` in config
- Add `@swagger` comments to routes
- Check console for errors

### Issue 5: Strict CSP Breaking Inline Scripts

**Error**: Scripts not executing with `strictCSP: true`

**Solution**:
- Move inline scripts to external files
- Use nonces for required inline scripts
- Or disable strict CSP: `"strictCSP": false`

## Testing After Migration

### 1. Health Checks

```bash
curl http://localhost:8080/health
curl http://localhost:8080/ready
curl http://localhost:8080/alive
```

### 2. API Endpoints

```bash
# Test existing API
curl http://localhost:8080/api/your-endpoint

# Test new response format
curl http://localhost:8080/api/users
```

### 3. SSR (if enabled)

```bash
# Test view rendering
curl http://localhost:8080/
```

### 4. Documentation (if enabled)

Visit: `http://localhost:8080/api/docs`

## Rollback Plan

If you encounter issues:

### Option 1: Revert to v3.x

```bash
npm install @misterzik/espressojs@3.3.6
git checkout v3-backup
```

### Option 2: Disable New Features

```json
{
  "features": {
    "ssr": {
      "enabled": false
    },
    "apiEnhancer": {
      "enabled": false
    }
  }
}
```

## Performance Considerations

### v4.0.0 Improvements

- **Faster startup**: Optimized middleware loading
- **Better caching**: Template caching in production
- **Reduced memory**: Removed deprecated dependencies
- **Improved security**: Better request validation

### Recommendations

1. **Enable caching in production**:
```json
{
  "features": {
    "ssr": {
      "cache": true
    }
  }
}
```

2. **Use rate limiting**:
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "max": 100
    }
  }
}
```

3. **Enable compression** (already enabled by default)

## New Exports

v4.0.0 adds new exports:

```javascript
const {
  apiManager,
  ssrManager,      // NEW
  apiEnhancer,     // NEW
  config,
  startServer,
  gracefulShutdown,
  server
} = require('@misterzik/espressojs');
```

## Deprecation Warnings

### Deprecated (will be removed in v5.0.0)

- **Bluebird promise library**: Use native Promises
- **Old Mongoose options**: Already removed in v4.0.0

### No longer supported

- Node.js < 18.0.0
- Mongoose deprecated connection options

## Getting Help

### Resources

- [GitHub Issues](https://github.com/misterzik/Espresso.js/issues)
- [Documentation](https://github.com/misterzik/Espresso.js#readme)
- [Examples](./examples/)

### Reporting Issues

When reporting migration issues, include:

1. Espresso.js version (before and after)
2. Node.js version
3. Error messages
4. Configuration file
5. Steps to reproduce

## Next Steps

After successful migration:

1. Read the [SSR Guide](./docs/SSR-GUIDE.md)
2. Explore [API Enhancements](./docs/API-ENHANCEMENT.md)
3. Review [Security Best Practices](./docs/SECURITY.md)
4. Check out [Examples](./examples/)

## Summary

✅ **Backward Compatible**: Old configs still work  
✅ **Opt-in Features**: Enable new features as needed  
✅ **Security Enhanced**: Better protection out of the box  
✅ **Performance Improved**: Faster and more efficient  
✅ **Well Documented**: Comprehensive guides available  

Welcome to Espresso.js v4.0.0! 🎉
