# EspressoJS Quick Start Guide

Get your Express.js server running in under 5 minutes!

## 🚀 Installation

```bash
npm install --save @misterzik/espressojs
```

## 📝 Step-by-Step Setup

### Step 1: Initialize Configuration

```bash
node cli init
```

This creates a `config.json` file with sensible defaults.

### Step 2: Create Your Entry Files

**Create `index.js`:**
```javascript
require("@misterzik/espressojs");
```

**Create `cli.js`:**
```javascript
require('@misterzik/espressojs/cli');
```

### Step 3: Create Public Directory

```bash
mkdir public
```

**Create `public/index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EspressoJS</title>
</head>
<body>
    <h1>Welcome to EspressoJS!</h1>
    <p>Your Express server is running successfully.</p>
</body>
</html>
```

### Step 4: Run Your Server

```bash
node cli run
```

Visit `http://localhost:8080` in your browser!

## 🎯 Next Steps

### Add Custom Routes

**Create `routes/api.js`:**
```javascript
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from EspressoJS!' });
});

module.exports = router;
```

**Enable API in `config.json`:**
```json
{
  "api": {
    "enabled": true
  }
}
```

Test it: `http://localhost:8080/api/hello`

### Add MongoDB

**Update `config.json`:**
```json
{
  "mongoDB": {
    "enabled": true,
    "uri": "your-cluster.mongodb.net",
    "instance": "myDatabase"
  }
}
```

**Create `.env`:**
```env
MONGO_USER=your_username
MONGO_TOKEN=your_password
```

### Use Health Checks

Built-in endpoints:
- `http://localhost:8080/health` - Full health check
- `http://localhost:8080/ready` - Readiness probe
- `http://localhost:8080/alive` - Liveness probe

## 📚 Common Commands

```bash
# Show current configuration
node cli show

# Change environment
node cli env --instance=production --port=3000

# Validate configuration
node cli validate

# Get help
node cli --help
```

## 🔧 Configuration Options

Customize your `config.json`:

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

## 🛡️ Security Features

EspressoJS includes:
- ✅ Helmet.js for secure headers
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS enabled
- ✅ Request size limits (10MB)
- ✅ XSS protection

## 📝 Logging

Logs are automatically created in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Errors only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled rejections

## 🎓 Examples

Check the `examples/` directory for:
- `basic-api.js` - REST API examples
- `mongodb-example.js` - MongoDB integration

## 💡 Tips

1. **Development Mode**: Use `npm run dev` for auto-restart
2. **Production**: Set `NODE_ENV=production` in your environment
3. **Custom Middleware**: Add to `index.js` before requiring EspressoJS
4. **Error Handling**: Use the built-in `asyncHandler` for async routes

## 🆘 Troubleshooting

**Port already in use?**
```bash
node cli env --port=3000
```

**MongoDB connection issues?**
- Check your `.env` credentials
- Verify MongoDB URI in `config.json`
- Ensure IP whitelist in MongoDB Atlas

**Missing favicon.ico error?**
- Create `public/favicon.ico` or ignore the warning

## 📖 Full Documentation

See [README.md](./README.md) for complete documentation.

## 🤝 Need Help?

- [GitHub Issues](https://github.com/misterzik/Espresso.js/issues)
- [GitHub Discussions](https://github.com/misterzik/Espresso.js/discussions)

Happy coding! ☕
