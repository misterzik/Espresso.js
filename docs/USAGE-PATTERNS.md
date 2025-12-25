# EspressoJS Usage Patterns

This guide explains the different ways to use EspressoJS and why some users need to manually call `app.listen()`.

## 📖 Table of Contents

- [Understanding the Issue](#understanding-the-issue)
- [Usage Pattern 1: CLI (Recommended)](#usage-pattern-1-cli-recommended)
- [Usage Pattern 2: Direct Execution](#usage-pattern-2-direct-execution)
- [Usage Pattern 3: Programmatic Usage](#usage-pattern-3-programmatic-usage)
- [Usage Pattern 4: Custom Entry Point](#usage-pattern-4-custom-entry-point)
- [Troubleshooting](#troubleshooting)

## Understanding the Issue

EspressoJS uses a conditional check to automatically start the server:

```javascript
if (require.main === module) {
  startServer();
}
```

**This check determines:**
- `true` = File is run directly → Server auto-starts
- `false` = File is required as module → Server does NOT auto-start

**When users report needing to add `app.listen()`:**
- They're using EspressoJS programmatically (Pattern 3 or 4)
- The `require.main === module` check is `false`
- The server doesn't auto-start
- They must manually start it

## Usage Pattern 1: CLI (Recommended)

**Best for:** Production deployments, standard usage

### Setup

```javascript
// cli.js
require('@misterzik/espressojs/cli');
```

```javascript
// index.js or espresso.js
require('@misterzik/espressojs');
```

### Run

```bash
node cli run
# or
npm start
```

### How It Works

1. CLI spawns: `node index.js`
2. `require.main === module` is `true`
3. Server auto-starts via `startServer()`
4. CLI keeps process alive

**✅ Advantages:**
- Automatic server startup
- Process management handled
- Configuration commands available
- Graceful shutdown built-in

**❌ Disadvantages:**
- Extra CLI layer
- Slightly more complex setup

## Usage Pattern 2: Direct Execution

**Best for:** Simple deployments, quick testing

### Setup

```javascript
// index.js
require('@misterzik/espressojs');
```

### Run

```bash
node index.js
```

### How It Works

1. Node runs `index.js` directly
2. `require.main === module` is `true`
3. Server auto-starts

**✅ Advantages:**
- Simple and direct
- No CLI needed
- Automatic startup

**❌ Disadvantages:**
- No CLI commands
- Manual configuration management

## Usage Pattern 3: Programmatic Usage

**Best for:** Custom applications, advanced integrations

### Setup (OLD - Requires Manual Listen)

```javascript
// server.js
const app = require('@misterzik/espressojs');
const config = require('@misterzik/espressojs/server');

// require.main === module is FALSE
// Server does NOT auto-start
// Must manually start:
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

### Setup (NEW - v3.3.6+ - Use startServer)

```javascript
// server.js
const { startServer } = require('@misterzik/espressojs');

// Use the exported startServer function
startServer();
```

### How It Works

**OLD Method:**
1. User requires EspressoJS as module
2. `require.main === module` is `false`
3. Server doesn't auto-start
4. User must call `app.listen()` manually

**NEW Method (v3.3.6+):**
1. User requires EspressoJS
2. Calls exported `startServer()` function
3. Server starts with all built-in features
4. Graceful shutdown and error handling included

**✅ Advantages:**
- Full control over server lifecycle
- Can add custom middleware before starting
- Integration with existing apps

**❌ Disadvantages:**
- More code required
- Must understand module system

## Usage Pattern 4: Custom Entry Point

**Best for:** Complex applications, microservices

### Setup

```javascript
// app.js (custom entry point)
const express = require('@misterzik/espressojs');
const { apiManager, config, startServer } = require('@misterzik/espressojs');

// Add custom middleware
express.use('/custom', (req, res) => {
  res.json({ message: 'Custom route' });
});

// Add custom error handling
express.use((err, req, res, next) => {
  console.error('Custom error handler:', err);
  res.status(500).json({ error: err.message });
});

// Start server with built-in features
startServer();
```

### Alternative: Manual Control

```javascript
// app.js (full manual control)
const app = require('@misterzik/espressojs');
const config = require('@misterzik/espressojs/server');

// Add custom routes
app.use('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Manual server start
const PORT = process.env.PORT || config.port;
const server = app.listen(PORT, () => {
  console.log(`Custom server on port ${PORT}`);
});

// Manual graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

**✅ Advantages:**
- Maximum flexibility
- Full control over everything
- Custom error handling

**❌ Disadvantages:**
- Most complex
- Must implement shutdown logic
- More maintenance

## Exported Functions (v3.3.6+)

EspressoJS now exports these functions for programmatic usage:

```javascript
const {
  startServer,        // Start server with all features
  gracefulShutdown,   // Graceful shutdown handler
  apiManager,         // API request manager
  config,             // Configuration object
  server              // HTTP server instance (after start)
} = require('@misterzik/espressojs');
```

### startServer()

Starts the Express server with all built-in features:
- Port binding
- Error handling
- Graceful shutdown
- Logging

```javascript
const { startServer } = require('@misterzik/espressojs');
startServer();
```

### gracefulShutdown(signal)

Manually trigger graceful shutdown:

```javascript
const { gracefulShutdown } = require('@misterzik/espressojs');

// Custom shutdown trigger
setTimeout(() => {
  gracefulShutdown('CUSTOM_SHUTDOWN');
}, 60000);
```

## Troubleshooting

### Server Doesn't Start

**Symptom:** No output, server not listening

**Cause:** Using programmatic pattern without calling `startServer()` or `app.listen()`

**Solution:**

```javascript
// Option 1: Use exported startServer
const { startServer } = require('@misterzik/espressojs');
startServer();

// Option 2: Manual listen
const app = require('@misterzik/espressojs');
const config = require('@misterzik/espressojs/server');
app.listen(config.port);
```

### Port Not Exposed

**Symptom:** Server starts but port not accessible

**Cause:** Server started but not bound to correct interface

**Solution:**

```javascript
// Bind to all interfaces (0.0.0.0)
const app = require('@misterzik/espressojs');
app.listen(8080, '0.0.0.0', () => {
  console.log('Server accessible on all interfaces');
});
```

### Server Exits Immediately

**Symptom:** Server starts then exits

**Cause:** No event loop keeping process alive

**Solution:**

Use CLI method or ensure `app.listen()` is called:

```bash
# Use CLI (recommended)
node cli run

# Or ensure listen is called in code
node index.js  # Must have app.listen() somewhere
```

### "Cannot find module" Error

**Symptom:** Module not found when requiring EspressoJS

**Cause:** Package not installed or wrong path

**Solution:**

```bash
# Install package
npm install @misterzik/espressojs

# Verify installation
npm list @misterzik/espressojs
```

## Best Practices

### 1. Use CLI for Standard Deployments

```bash
npm start
```

### 2. Use startServer() for Programmatic Usage

```javascript
const { startServer } = require('@misterzik/espressojs');
startServer();
```

### 3. Use Manual Listen for Maximum Control

```javascript
const app = require('@misterzik/espressojs');
// Add custom middleware
app.listen(3000);
```

### 4. Always Handle Errors

```javascript
const { startServer } = require('@misterzik/espressojs');

try {
  startServer();
} catch (error) {
  console.error('Failed to start:', error);
  process.exit(1);
}
```

### 5. Use Environment Variables

```javascript
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
```

## Migration Guide

### From Manual Listen to startServer()

**Before (v3.3.5 and earlier):**

```javascript
const app = require('@misterzik/espressojs');
const config = require('@misterzik/espressojs/server');

app.listen(config.port, () => {
  console.log(`Server running on ${config.port}`);
});
```

**After (v3.3.6+):**

```javascript
const { startServer } = require('@misterzik/espressojs');

startServer();
// Logging and error handling included automatically
```

### Benefits of Migration

- ✅ Built-in error handling
- ✅ Graceful shutdown
- ✅ Consistent logging
- ✅ Less boilerplate code

## Summary

| Pattern | Auto-Start | Use Case | Complexity |
|---------|-----------|----------|------------|
| CLI | ✅ Yes | Production | Low |
| Direct | ✅ Yes | Testing | Low |
| Programmatic | ❌ No* | Integration | Medium |
| Custom | ❌ No* | Advanced | High |

*Use `startServer()` in v3.3.6+ for auto-start with full features

## Support

- **GitHub Issues**: https://github.com/misterzik/Espresso.js/issues
- **Documentation**: https://github.com/misterzik/Espresso.js
- **npm Package**: https://www.npmjs.com/package/@misterzik/espressojs

---

**Version:** 3.3.6+  
**Last Updated:** 2024-12-25
