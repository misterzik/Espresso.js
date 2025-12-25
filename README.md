![Espresso](https://raw.githubusercontent.com/misterzik/Espresso.js/main/espresso.png)

# EspressoJS

> **A modern, production-ready Express.js boilerplate with built-in security, logging, and best practices.**

[![npm version](https://img.shields.io/npm/v/@misterzik/espressojs.svg)](https://www.npmjs.com/package/@misterzik/espressojs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- ⚡ **Quick Setup** - Get your Express server running in seconds
- 🔒 **Security First** - Helmet, rate limiting, and CORS pre-configured
- 📝 **Advanced Logging** - Winston logger with file and console transports
- 🛡️ **Error Handling** - Centralized error handling middleware
- 🔧 **Configuration Management** - JSON-based config with validation
- 💾 **MongoDB Ready** - Optional MongoDB integration with Mongoose
- 🏥 **Health Checks** - Built-in health, readiness, and liveness endpoints
- 🎯 **CLI Tools** - Powerful command-line interface for management
- 🔄 **Graceful Shutdown** - Proper cleanup of resources on exit
- 📦 **Production Ready** - Compression, caching, and optimization built-in

## 📋 Requirements

- **Node.js** >= 14.x
- **npm** >= 6.x

## 📦 Installation

```bash
npm install --save @misterzik/espressojs
```

## 🎯 Quick Start

### 1. Initialize Configuration

```bash
node cli init
```

This creates a `config.json` file with default settings:

```json
{
  "instance": "development",
  "port": 8080,
  "hostname": "",
  "mongoDB": {
    "enabled": false,
    "port": null,
    "uri": "",
    "instance": "database"
  },
  "api": {
    "enabled": false,
    "uri": "",
    "url": "",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

### 2. Create Environment File (Optional)

Create a `.env` file for sensitive data:

```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
API_TOKEN=your_api_token
NODE_ENV=development
```

### 3. Create Your Main File

Create `index.js` or `espresso.js`:

```javascript
require("@misterzik/espressojs");
```

### 4. Create CLI File

Create `cli.js`:

```javascript
require('@misterzik/espressojs/cli');
```

### 5. Run Your Server

```bash
# Using the CLI
node cli run

# Or using npm scripts
npm start
```

## 🛠️ CLI Commands

EspressoJS comes with a powerful CLI for managing your application:

```bash
# Show current configuration
node cli show

# Run the server
node cli run

# Run with auto-restart (development)
npm run start:watch

# Update environment settings
node cli env --instance=production --port=3000

# Validate configuration
node cli validate

# Initialize new config
node cli init

# Validate configuration
node cli validate

# Show version information
node cli version

# Get help
node cli --help
```

### npm Scripts

EspressoJS provides convenient npm scripts for common tasks:

```bash
# Start server
npm start                    # Start with current config
npm run start:watch          # Start with auto-restart (nodemon)

# Development
npm run dev                  # Start in development mode
npm run dev:watch            # Dev mode with auto-restart

# Production
npm run prod                 # Start in production mode

# Configuration
npm run show                 # Display current config
npm run validate             # Validate config.json
```

**Process Management:**

The CLI uses a parent-child process model to keep your server running:
- Parent process (CLI) manages the server lifecycle
- Child process runs the Express application
- `process.stdin.resume()` keeps the event loop active
- Press `CTRL+C` for graceful shutdown

For more details, see [CLI Usage Documentation](./docs/CLI-USAGE.md).

## 📁 Project Structure

```
your-project/
├── config.json              # Configuration file
├── .env                     # Environment variables
├── index.js                 # Main application file
├── cli.js                   # CLI entry point
├── public/                  # Static files
│   ├── index.html
│   └── favicon.ico
├── routes/                  # Custom routes
│   ├── api.js
│   └── db.js
└── logs/                    # Application logs (auto-created)
    ├── combined.log
    ├── error.log
    ├── exceptions.log
    └── rejections.log
```

## 🔧 Configuration

### Environment Instances

EspressoJS supports three pre-configured environments:

- **development** - Development mode with debug logging
- **production** - Production mode with optimized settings
- **global** - Global/staging environment

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `instance` | string | Environment instance | `development` |
| `port` | number | Server port | `8080` |
| `hostname` | string | Server hostname | `""` |
| `publicDirectory` | string | Public files directory | `"/public"` |
| `mongoDB.enabled` | boolean | Enable MongoDB | `false` |
| `mongoDB.uri` | string | MongoDB URI | `""` |
| `mongoDB.port` | number | MongoDB port | `null` |
| `mongoDB.instance` | string | Database name | `database` |
| `api.enabled` | boolean | Enable API routes | `false` |
| `api.uri` | string | External API URI | `""` |
| `api.method` | string | HTTP method | `GET` |
| `api.headers` | object | Request headers | `{"Content-Type": "application/json"}` |
| `api.timeout` | number | Request timeout (ms) | `30000` |
| `api.retries` | number | Retry attempts (0-5) | `0` |

### Multiple API Endpoints

EspressoJS supports multiple API configurations using the pattern `api`, `api2`, `api3`, etc.:

```json
{
  "api": {
    "enabled": true,
    "uri": "https://api.example.com/v1/",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "api2": {
    "uri": "https://api.example.com/v1/news",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer TOKEN"
    }
  },
  "api3": {
    "enabled": true,
    "uri": "https://api.example.com/api",
    "method": "POST"
  }
}
```

**Using Multiple APIs in Your Code:**

```javascript
const { apiManager } = require('./index');

// Request from specific API
const data = await apiManager.request('api2', '/endpoint');

// Parallel requests
const [data1, data2] = await Promise.all([
  apiManager.request('api', '/users'),
  apiManager.request('api2', '/news')
]);

// Check if API exists
if (apiManager.hasAPI('api3')) {
  const data = await apiManager.request('api3', '/data');
}
```

📖 **[Full Multiple APIs Guide](./docs/MULTIPLE-APIS.md)**

## 🏥 Health Check Endpoints

EspressoJS includes built-in health check endpoints:

- **GET /health** - Comprehensive health check with system metrics
- **GET /ready** - Readiness probe for orchestration
- **GET /alive** - Liveness probe for monitoring

Example response from `/health`:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "memory": {
    "total": 16777216000,
    "free": 8388608000,
    "usage": {...}
  },
  "cpu": {
    "cores": 8,
    "loadAverage": [1.5, 1.3, 1.2]
  },
  "database": {
    "status": "connected",
    "name": "myDatabase"
  }
}
```

## 🔒 Security Features

EspressoJS includes enterprise-grade security features:

- **Helmet.js** - Sets secure HTTP headers
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Express-validator integration
- **XSS Protection** - Cross-site scripting prevention
- **Content Security Policy** - CSP headers configured

## 📝 Logging

Winston-based logging with multiple transports:

```javascript
const logger = require('./server/utils/logger');

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message');
logger.http('HTTP request');
```

Logs are automatically written to:
- Console (formatted with colors)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)
- `logs/exceptions.log` (uncaught exceptions)
- `logs/rejections.log` (unhandled rejections)

## 🔌 MongoDB Integration

Enable MongoDB in your `config.json`:

```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "cluster0.mongodb.net",
    "port": null,
    "instance": "myDatabase"
  }
}
```

Set credentials in `.env`:

```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
```

## 🛣️ Custom Routes

Create custom routes in the `routes/` directory:

**routes/api.js:**
```javascript
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  res.json({ users: [] });
});

module.exports = router;
```

## 🚀 Deployment

### Production Mode

```bash
# Set production environment
node cli env --instance=production --port=80

# Run in production
npm run prod
```

### Environment Variables

Set these in production:

```env
NODE_ENV=production
PORT=80
MONGO_USER=prod_user
MONGO_TOKEN=prod_password
```

## 📊 NPM Scripts

```json
{
  "scripts": {
    "start": "node cli run",
    "dev": "node cli env --instance=development --port=8080 && node cli run",
    "prod": "node cli env --instance=production --port=80 && node cli run",
    "show": "node cli show"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [MisterZik](https://github.com/misterzik)

## 🔗 Links

- [GitHub Repository](https://github.com/misterzik/Espresso.js)
- [npm Package](https://www.npmjs.com/package/@misterzik/espressojs)
- [Issue Tracker](https://github.com/misterzik/Espresso.js/issues)

## 💡 Support

If you find EspressoJS helpful, please consider giving it a ⭐ on GitHub!
