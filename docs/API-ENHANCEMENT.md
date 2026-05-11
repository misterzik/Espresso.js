# API Enhancement Guide

## Overview

Espresso.js v4.0.0 introduces powerful API enhancements including automatic Swagger documentation, API versioning, request/response formatting, and advanced validation.

## Features

- **Swagger/OpenAPI Documentation**: Auto-generated interactive API docs
- **API Versioning**: URL and header-based versioning
- **Response Formatting**: Consistent JSON responses
- **Request Validation**: Built-in validation middleware
- **API Key Authentication**: Simple API key validation
- **Pagination Helpers**: Standard pagination responses
- **CORS Configuration**: Fine-grained CORS control
- **Caching**: Response caching support

## Quick Start

### 1. Enable API Enhancements

Update your `config.json`:

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
      "description": "API documentation for my application"
    }
  }
}
```

### 2. Access API Documentation

Start your server and visit:
```
http://localhost:8080/api/docs
```

### 3. Create API Routes with Documentation

**routes/api/users.js**:
```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { apiEnhancer } = require('../../index');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.success(users, 'Users retrieved successfully');
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
  ],
  apiEnhancer.validationMiddleware(),
  async (req, res) => {
    const user = await User.create(req.body);
    res.success(user, 'User created successfully', 201);
  }
);

module.exports = router;
```

## Response Formatting

### Success Response

```javascript
res.success(data, message, statusCode);
```

**Example**:
```javascript
res.success({ id: 1, name: 'John' }, 'User retrieved', 200);
```

**Output**:
```json
{
  "status": "success",
  "message": "User retrieved",
  "data": {
    "id": 1,
    "name": "John"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```javascript
res.error(message, statusCode, errors);
```

**Example**:
```javascript
res.error('Validation failed', 400, [
  { field: 'email', message: 'Invalid email format' }
]);
```

**Output**:
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response

```javascript
res.paginate(data, page, limit, total);
```

**Example**:
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const total = await User.countDocuments();
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);

res.paginate(users, page, limit, total);
```

**Output**:
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## API Versioning

### URL-Based Versioning

```javascript
// routes/api/v1/users.js
router.get('/api/v1/users', (req, res) => {
  res.success(users, 'Users from v1');
});

// routes/api/v2/users.js
router.get('/api/v2/users', (req, res) => {
  res.success(usersWithNewFields, 'Users from v2');
});
```

### Header-Based Versioning

```javascript
router.get('/api/users', (req, res) => {
  const version = req.apiVersion; // Set by versioningMiddleware
  
  if (version === 'v2') {
    res.success(usersV2, 'Users v2');
  } else {
    res.success(usersV1, 'Users v1');
  }
});
```

**Request**:
```bash
curl -H "API-Version: v2" http://localhost:8080/api/users
```

## Request Validation

### Using express-validator

```javascript
const { body, query, param } = require('express-validator');

router.post('/users',
  [
    body('name').notEmpty().trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('age').optional().isInt({ min: 18, max: 120 }),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  ],
  apiEnhancer.validationMiddleware(),
  async (req, res) => {
    // Validation passed, proceed with logic
    const user = await User.create(req.body);
    res.success(user, 'User created', 201);
  }
);

router.get('/users/:id',
  [
    param('id').isMongoId(),
  ],
  apiEnhancer.validationMiddleware(),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.error('User not found', 404);
    }
    res.success(user);
  }
);

router.get('/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['name', 'email', 'createdAt']),
  ],
  apiEnhancer.validationMiddleware(),
  async (req, res) => {
    // Query params validated
    const users = await getUsers(req.query);
    res.success(users);
  }
);
```

## API Key Authentication

### Basic API Key

```javascript
const { apiEnhancer } = require('../../index');

const validKeys = [
  process.env.API_KEY_1,
  process.env.API_KEY_2,
];

router.use('/api/protected', apiEnhancer.apiKeyAuth(validKeys));

router.get('/api/protected/data', (req, res) => {
  res.success({ secret: 'data' });
});
```

**Request**:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:8080/api/protected/data
```

### Per-Route API Key

```javascript
router.get('/api/public', (req, res) => {
  res.success({ message: 'Public data' });
});

router.get('/api/private',
  apiEnhancer.apiKeyAuth(['key1', 'key2']),
  (req, res) => {
    res.success({ message: 'Private data' });
  }
);
```

## Swagger Documentation

### Complete Example

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         name: John Doe
 *         email: john@example.com
 *         createdAt: 2024-01-01T00:00:00.000Z
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get('/users/:id',
  apiEnhancer.apiKeyAuth(validKeys),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.error('User not found', 404);
    }
    res.success(user);
  }
);
```

## Advanced Features

### Rate Limiting per Endpoint

```javascript
const { createRateLimiter } = require('../../server/middleware/security');

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later'
});

router.post('/api/auth/login', strictLimiter, async (req, res) => {
  // Login logic
});
```

### Response Caching

```javascript
router.get('/api/posts',
  apiEnhancer.cacheControl(300), // Cache for 5 minutes
  async (req, res) => {
    const posts = await Post.find();
    res.success(posts);
  }
);
```

### CORS Configuration

```javascript
const corsOptions = {
  origins: ['https://example.com', 'https://app.example.com'],
  methods: 'GET,POST,PUT,DELETE',
  headers: 'Content-Type,Authorization',
  credentials: true
};

router.use('/api', apiEnhancer.corsConfig(corsOptions));
```

### Request Logging

```javascript
router.use('/api', apiEnhancer.requestLogger());
```

## External API Integration

### Using API Manager

```javascript
const { apiManager } = require('../../index');

router.get('/api/external/users', async (req, res) => {
  try {
    const data = await apiManager.request('api', '/users');
    res.success(data);
  } catch (error) {
    res.error('Failed to fetch external data', 500);
  }
});

// Parallel requests
router.get('/api/dashboard', async (req, res) => {
  try {
    const [users, posts, comments] = await Promise.all([
      apiManager.request('api', '/users'),
      apiManager.request('api2', '/posts'),
      apiManager.request('api3', '/comments')
    ]);
    
    res.success({ users, posts, comments });
  } catch (error) {
    res.error('Failed to fetch dashboard data', 500);
  }
});
```

## Best Practices

### 1. Consistent Error Handling

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.success(users);
}));
```

### 2. Input Sanitization

```javascript
const { body } = require('express-validator');

router.post('/users',
  [
    body('name').trim().escape(),
    body('email').normalizeEmail(),
    body('bio').trim().stripLow(),
  ],
  apiEnhancer.validationMiddleware(),
  async (req, res) => {
    // Sanitized input
  }
);
```

### 3. API Versioning Strategy

```javascript
// Keep old versions for backward compatibility
router.get('/api/v1/users', getUsersV1);
router.get('/api/v2/users', getUsersV2);

// Deprecation warnings
router.get('/api/v1/users', (req, res, next) => {
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Sunset', '2025-12-31');
  next();
}, getUsersV1);
```

### 4. Documentation Standards

- Document all endpoints with Swagger
- Include request/response examples
- Specify all possible status codes
- Document authentication requirements
- Provide schema definitions

## Testing API Endpoints

### Using cURL

```bash
# GET request
curl http://localhost:8080/api/users

# POST request
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# With API key
curl -H "X-API-Key: your-key" http://localhost:8080/api/protected

# With versioning
curl -H "API-Version: v2" http://localhost:8080/api/users
```

### Using Postman

1. Import Swagger JSON from `/api/docs.json`
2. Set environment variables for API keys
3. Create test collections
4. Use pre-request scripts for authentication

## Migration from v3.x

### Before (v3.x)
```javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

### After (v4.0.0)
```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 */
app.get('/api/users', (req, res) => {
  res.success([], 'Users retrieved successfully');
});
```

## Troubleshooting

### Swagger Docs Not Showing
- Ensure `documentation: true` in config
- Check that routes have JSDoc comments
- Verify `apis` path in swagger options

### Validation Not Working
- Import `validationMiddleware` correctly
- Place validation before route handler
- Check validator syntax

### API Key Rejected
- Verify API key in headers
- Check environment variables
- Ensure key is in validKeys array

## Examples

Complete API examples in `examples/api/`:

- **REST API**: Full CRUD operations
- **GraphQL**: GraphQL integration
- **Microservices**: Service communication
- **Webhooks**: Webhook handling

## Next Steps

- [SSR Guide](./SSR-GUIDE.md)
- [Security Best Practices](./SECURITY.md)
- [Performance Optimization](./PERFORMANCE.md)
