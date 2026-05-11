# Espresso.js v4.0.0 Quick Reference

## 🚀 Installation

```bash
npm install @misterzik/espressojs@4.0.0
```

## ⚡ Quick Start

```bash
# Create config
node cli init

# Start server
npm start

# Development with auto-reload
npm run dev:watch
```

## 📋 Configuration Cheat Sheet

### Minimal Config
```json
{
  "instance": "development",
  "port": 8080
}
```

### Full Config
```json
{
  "instance": "development",
  "port": 8080,
  "publicDirectory": "/public",
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": false
    },
    "apiEnhancer": {
      "enabled": true,
      "documentation": true,
      "prefix": "/api",
      "version": "v1"
    }
  },
  "security": {
    "rateLimit": { "enabled": true, "max": 100 },
    "strictCSP": false
  },
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "instance": "mydb"
  }
}
```

## 🎨 SSR Quick Reference

### Enable SSR
```json
{ "features": { "ssr": { "enabled": true, "engine": "ejs" } } }
```

### Render View
```javascript
app.get('/', (req, res) => {
  res.renderView('index', { title: 'Home', user: req.user });
});
```

### Template Syntax (EJS)
```html
<h1><%= title %></h1>
<% if (user) { %>
  <p>Welcome <%= user.name %></p>
<% } %>
<% items.forEach(item => { %>
  <li><%= item %></li>
<% }); %>
```

## 🚀 API Quick Reference

### Enable API Docs
```json
{ "features": { "apiEnhancer": { "enabled": true, "documentation": true } } }
```

### Response Helpers
```javascript
// Success
res.success(data, 'Message', 200);

// Error
res.error('Error message', 400);

// Paginated
res.paginate(items, page, limit, total);
```

### Swagger Documentation
```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/api/users', (req, res) => {
  res.success(users);
});
```

### Validation
```javascript
const { body } = require('express-validator');
const { apiEnhancer } = require('./index');

app.post('/users',
  [
    body('email').isEmail(),
    body('name').trim().notEmpty()
  ],
  apiEnhancer.validationMiddleware(),
  (req, res) => {
    res.success(user, 'Created', 201);
  }
);
```

## 🔒 Security Quick Reference

### Built-in Protection
- ✅ Helmet (HTTP headers)
- ✅ Rate limiting
- ✅ CORS
- ✅ MongoDB sanitization
- ✅ HPP protection
- ✅ Input validation

### Custom Rate Limiter
```javascript
const { createRateLimiter } = require('./server/middleware/security');

const strict = createRateLimiter({ max: 5, windowMs: 900000 });
app.post('/login', strict, handleLogin);
```

### API Key Auth
```javascript
const { apiEnhancer } = require('./index');
const keys = [process.env.API_KEY];

app.use('/api/protected', apiEnhancer.apiKeyAuth(keys));
```

## 📊 Health Checks

```bash
# Health check
curl http://localhost:8080/health

# Readiness probe
curl http://localhost:8080/ready

# Liveness probe
curl http://localhost:8080/alive
```

## 🗄️ MongoDB

### Enable
```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "cluster.mongodb.net",
    "instance": "database"
  }
}
```

### Environment Variables
```env
MONGO_USER=username
MONGO_TOKEN=password
```

## 📝 Logging

```javascript
const logger = require('./server/utils/logger');

logger.info('Info message');
logger.warn('Warning');
logger.error('Error');
logger.debug('Debug info');
logger.http('HTTP request');
```

## 🔧 CLI Commands

```bash
# Show config
node cli show

# Validate config
node cli validate

# Set environment
node cli env --instance=production --port=80

# Run server
node cli run

# Version info
node cli version
```

## 📦 npm Scripts

```bash
npm start              # Start server
npm run start:watch    # Start with auto-reload
npm run dev            # Development mode
npm run dev:watch      # Dev with auto-reload
npm run prod           # Production mode
npm run show           # Show config
npm run validate       # Validate config
npm audit              # Security audit
npm audit fix          # Fix vulnerabilities
```

## 🌐 Routes

### Basic Route
```javascript
app.get('/path', (req, res) => {
  res.json({ message: 'Hello' });
});
```

### Async Route
```javascript
const { asyncHandler } = require('./server/middleware/errorHandler');

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.success(users);
}));
```

### SSR Route
```javascript
app.get('/page', (req, res) => {
  res.renderView('page', { data });
});
```

## 🔄 External APIs

### Configure
```json
{
  "api": {
    "enabled": true,
    "uri": "https://api.example.com",
    "timeout": 30000,
    "retries": 3
  }
}
```

### Use
```javascript
const { apiManager } = require('./index');

const data = await apiManager.request('api', '/endpoint');
```

## 🎯 Common Patterns

### Error Handling
```javascript
const { AppError } = require('./server/middleware/errorHandler');

throw new AppError('Not found', 404);
```

### Middleware
```javascript
const myMiddleware = (req, res, next) => {
  // Do something
  next();
};

app.use(myMiddleware);
```

### Authentication
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.error('Unauthorized', 401);
  // Verify token
  next();
};

app.get('/protected', verifyToken, handler);
```

## 📁 Directory Structure

```
project/
├── config.json          # Configuration
├── .env                 # Environment variables
├── index.js             # Main file
├── cli.js               # CLI wrapper
├── public/              # Static files
├── views/               # Templates (SSR)
├── routes/              # Route handlers
│   ├── api/            # API routes
│   └── db/             # Database routes
├── server/
│   ├── config/         # Environment configs
│   ├── controllers/    # Business logic
│   ├── middleware/     # Middleware
│   ├── models/         # Mongoose models
│   └── utils/          # Utilities
└── logs/               # Log files
```

## 🔍 Debugging

### Enable Debug Logs
```bash
NODE_ENV=development npm start
```

### Check Logs
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

## 🚨 Troubleshooting

### Port in Use
```bash
lsof -i :8080
kill -9 <PID>
```

### MongoDB Connection Failed
- Check `.env` credentials
- Verify MongoDB URI
- Test network connectivity

### Views Not Found
- Check `viewsDir` in config
- Verify file extensions
- Ensure SSR is enabled

## 📚 Documentation Links

- [Full README](./README.md)
- [Migration Guide](./MIGRATION-V4.md)
- [SSR Guide](./docs/SSR-GUIDE.md)
- [API Enhancement](./docs/API-ENHANCEMENT.md)
- [Security Guide](./docs/SECURITY.md)
- [Changelog](./CHANGELOG.md)

## 🎓 Examples

### Simple API
```javascript
require('dotenv').config();
const app = require('@misterzik/espressojs');

app.get('/api/hello', (req, res) => {
  res.success({ message: 'Hello World' });
});
```

### SSR Application
```javascript
// config.json
{ "features": { "ssr": { "enabled": true } } }

// index.js
const app = require('@misterzik/espressojs');

app.get('/', (req, res) => {
  res.renderView('index', { title: 'Home' });
});
```

### Hybrid App
```javascript
const app = require('@misterzik/espressojs');

// SSR routes
app.get('/', (req, res) => {
  res.renderView('index');
});

// API routes
app.get('/api/data', (req, res) => {
  res.success({ data: [] });
});
```

## 💡 Pro Tips

1. **Use environment variables** for sensitive data
2. **Enable caching** in production (`"cache": true`)
3. **Use strict CSP** in production (`"strictCSP": true`)
4. **Validate all inputs** with express-validator
5. **Monitor logs** regularly
6. **Keep dependencies updated** (`npm audit`)
7. **Use health checks** for monitoring
8. **Enable API docs** for better DX

## 🎯 Version Info

- **Current**: 4.0.0
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

## 📞 Help

- Issues: https://github.com/misterzik/Espresso.js/issues
- Docs: https://github.com/misterzik/Espresso.js

---

**Quick Reference Card** | Espresso.js v4.0.0 | MIT License
