# EspressoJS v4.0.0 Examples

This directory contains comprehensive example implementations showcasing all the new features in v4.0.0.

## 📁 Available Examples

### 🆕 New in v4.0.0

### `basic-api.js`
Demonstrates how to create RESTful API routes with:
- GET, POST, PUT, DELETE operations
- Request validation using express-validator
- Error handling with asyncHandler
- Proper response formatting

**Usage:**
```javascript
// In your routes/api.js
module.exports = require('./examples/basic-api');
```

### `mongodb-example.js`
Shows MongoDB integration with Mongoose:
- Schema definition and validation
- CRUD operations
- Pagination
- Search functionality
- Error handling

**Usage:**
```javascript
// In your routes/db.js
module.exports = require('./examples/mongodb-example');
```

### `multiple-apis.js` ⭐ NEW
Demonstrates using multiple API endpoints:
- Making requests to different APIs (api, api2, api3)
- Parallel API requests
- Custom request options
- Creating Axios instances
- Conditional API usage and fallbacks
- API proxy patterns
- Error handling with retries

**Usage:**
```javascript
// In your routes/api.js
module.exports = require('./examples/multiple-apis');
```

**Configuration:**
```json
{
  "api": {
    "enabled": true,
    "uri": "https://api.example.com/v1/"
  },
  "api2": {
    "uri": "https://api.example.com/v1/news"
  },
  "api3": {
    "uri": "https://api.example.com/api"
  }
}
```

### `ssr-example.js` ⭐ NEW
Server-Side Rendering implementation with:
- Multiple page types (home, blog, profile, dashboard)
- Dynamic data binding
- Layouts and partials
- Form handling
- Search functionality
- Error pages

**Usage:**
```javascript
// In your main app
const ssrRoutes = require('./examples/ssr-example');
app.use('/', ssrRoutes);
```

**Configuration:**
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

### `api-v4-example.js` ⭐ NEW
Enhanced API with v4.0.0 features:
- Swagger/OpenAPI documentation
- Response formatting (success, error, paginate)
- Request validation
- CRUD operations
- Search functionality
- API key authentication

**Usage:**
```javascript
// In your routes/api/index.js
const apiRoutes = require('./examples/api-v4-example');
app.use('/api', apiRoutes);
```

**Configuration:**
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

### `hybrid-app-example.js` ⭐ NEW
Hybrid SSR + API application:
- Combined web pages and API endpoints
- Progressive enhancement
- Works with or without JavaScript
- Shared authentication
- Todo app example

**Usage:**
```javascript
// In your main app
const hybridApp = require('./examples/hybrid-app-example');
app.use('/', hybridApp);
```

### `security-example.js` ⭐ NEW
Security best practices:
- JWT authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Protected routes

**Usage:**
```javascript
// In your routes/auth.js
const authRoutes = require('./examples/security-example');
app.use('/auth', authRoutes);
```

**Environment Variables:**
```env
JWT_SECRET=your-secret-key-here
```

## 🚀 Getting Started

1. Copy the example file you want to use
2. Place it in your `routes/` directory
3. Install any additional dependencies (jwt, bcrypt, etc.)
4. Configure features in `config.json`
5. Customize for your needs

## 💡 Tips

- Use `asyncHandler` for all async route handlers
- Validate input with express-validator
- Return consistent response formats
- Use proper HTTP status codes
- Handle errors gracefully

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express Validator](https://express-validator.github.io/)

## 🤝 Contributing

Have a useful example? Submit a PR to share it with the community!
