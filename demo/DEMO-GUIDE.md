# EspressoJS v4.0.0 Demo Guide

## 🎯 What's Included

This demo showcases all the major features of EspressoJS v4.0.0:

### ✅ Core Features
- Express server with plug-and-play configuration
- Security middleware (Helmet, Rate Limiting, HPP, Sanitization)
- Advanced logging with Winston
- Health check endpoints
- Graceful shutdown

### 🆕 New in v4.0.0
- **Server-Side Rendering** (optional)
- **API Documentation** with Swagger UI
- **Enhanced Security** (NoSQL injection prevention, strict CSP)
- **Response Formatting** helpers
- **Request Validation** middleware

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Choose Your Demo Mode

#### Option A: API-Only Mode (Default)
Perfect for building RESTful APIs with documentation.

**Configuration:** Already set in `config.json`
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

**Start:**
```bash
npm start
```

**Access:**
- API Documentation: http://localhost:8080/api/docs
- API Endpoints: http://localhost:8080/api/*
- Health Check: http://localhost:8080/health

#### Option B: SSR Mode
Perfect for building server-rendered web applications.

**Update `config.json`:**
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

**Create views directory:**
```bash
mkdir views
```

**Copy example templates:**
```bash
cp ../views/*.ejs views/
```

**Start:**
```bash
npm start
```

**Access:**
- Homepage: http://localhost:8080/

#### Option C: Hybrid Mode
Combine SSR and API in one application.

**Update `config.json`:**
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs"
    },
    "apiEnhancer": {
      "enabled": true,
      "documentation": true
    }
  }
}
```

**Access:**
- Web Pages: http://localhost:8080/
- API Docs: http://localhost:8080/api/docs
- API Endpoints: http://localhost:8080/api/*

## 📚 Available Endpoints

### Health Checks
```bash
# Comprehensive health check
curl http://localhost:8080/health

# Kubernetes readiness probe
curl http://localhost:8080/ready

# Kubernetes liveness probe
curl http://localhost:8080/alive
```

### API Endpoints (if enabled)
```bash
# View API documentation
open http://localhost:8080/api/docs

# Test API endpoint
curl http://localhost:8080/api/v2/

# Get specific resource
curl http://localhost:8080/api/v2/people/1

# Check API health
curl http://localhost:8080/api/v2/health
```

## 🔧 Configuration Options

### Enable/Disable Features

**SSR:**
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",        // or "handlebars" or "pug"
      "viewsDir": "views",
      "cache": false          // true in production
    }
  }
}
```

**API Documentation:**
```json
{
  "features": {
    "apiEnhancer": {
      "enabled": true,
      "documentation": true,
      "prefix": "/api",
      "title": "My API",
      "description": "API documentation"
    }
  }
}
```

**Security:**
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "max": 100,
      "windowMs": 900000
    },
    "strictCSP": false        // true for production
  }
}
```

**MongoDB:**
```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "instance": "myDatabase"
  }
}
```

**Environment Variables (.env):**
```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
NODE_ENV=development
JWT_SECRET=your-secret-key
```

## 🎨 Customization

### Add Your Own Routes

**API Routes:**
```javascript
// routes/api/custom.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/custom:
 *   get:
 *     summary: Custom endpoint
 */
router.get('/custom', (req, res) => {
  res.success({ message: 'Custom endpoint' });
});

module.exports = router;
```

**SSR Routes:**
```javascript
// routes/pages.js
const express = require('express');
const router = express.Router();

router.get('/custom-page', (req, res) => {
  res.renderView('custom', {
    title: 'Custom Page',
    data: {}
  });
});

module.exports = router;
```

### Create Custom Views

**views/custom.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>Your custom content here</p>
</body>
</html>
```

## 🧪 Testing the Demo

### Test API Endpoints

```bash
# Get all resources
curl http://localhost:8080/api/v2/

# Get specific resource
curl http://localhost:8080/api/v2/people/1

# Test with invalid ID (should return error)
curl http://localhost:8080/api/v2/people/999

# Test rate limiting (make 150+ requests quickly)
for i in {1..150}; do curl http://localhost:8080/api/v2/; done
```

### Test SSR

```bash
# View rendered HTML
curl http://localhost:8080/

# Test with query parameters
curl "http://localhost:8080/search?q=test"

# Test 404 page
curl http://localhost:8080/nonexistent
```

### Test Security

```bash
# Test NoSQL injection (should be sanitized)
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": {"$gt": ""}, "password": "test"}'

# Test XSS (should be escaped)
curl "http://localhost:8080/?name=<script>alert('xss')</script>"

# Test rate limiting
for i in {1..150}; do curl http://localhost:8080/api/v2/; done
```

## 📊 Monitoring

### View Logs

```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log

# HTTP requests
tail -f logs/combined.log | grep "GET\|POST\|PUT\|DELETE"
```

### Health Monitoring

```bash
# Check system health
curl http://localhost:8080/health | jq

# Monitor uptime
watch -n 5 'curl -s http://localhost:8080/health | jq .uptime'
```

## 🚀 Deployment

### Production Configuration

**Update `config.json`:**
```json
{
  "instance": "production",
  "port": 80,
  "features": {
    "ssr": {
      "cache": true
    }
  },
  "security": {
    "strictCSP": true
  }
}
```

**Set Environment:**
```bash
export NODE_ENV=production
export PORT=80
```

**Start:**
```bash
npm run prod
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port
node cli env --port=3000
```

### API Documentation Not Showing
- Ensure `documentation: true` in config
- Check browser console for errors
- Verify routes have `@swagger` comments

### Views Not Found
- Check `viewsDir` path in config
- Ensure views directory exists
- Verify file extensions match engine

### MongoDB Connection Failed
- Check `.env` credentials
- Verify MongoDB URI
- Test network connectivity

## 💡 Next Steps

1. **Explore Examples:** Check `../examples/` for more code samples
2. **Read Docs:** See `../docs/` for comprehensive guides
3. **Customize:** Modify routes, views, and configuration
4. **Deploy:** Follow production deployment guide
5. **Contribute:** Share your improvements!

## 📚 Resources

- [Full Documentation](../README.md)
- [SSR Guide](../docs/SSR-GUIDE.md)
- [API Enhancement Guide](../docs/API-ENHANCEMENT.md)
- [Security Guide](../docs/SECURITY.md)
- [Migration Guide](../MIGRATION-V4.md)
- [Quick Reference](../QUICK-REFERENCE.md)

## 🎉 Enjoy EspressoJS v4.0.0!

Happy coding! ☕
