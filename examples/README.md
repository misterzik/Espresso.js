# EspressoJS Examples

This directory contains example implementations to help you get started with EspressoJS.

## 📁 Available Examples

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

## 🚀 Getting Started

1. Copy the example file you want to use
2. Place it in your `routes/` directory
3. Customize it for your needs
4. Enable the routes in your `config.json`

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
