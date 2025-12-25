# EspressoJS CLI Usage Guide

## Overview

The EspressoJS CLI provides a powerful command-line interface for managing your Express server. This guide covers all available commands and best practices.

## Installation

```bash
npm install @misterzik/espressojs
```

## Available Commands

### `run` - Start the Server

Starts the Express server with the current configuration.

```bash
node cli run
```

**How it works:**
- The CLI spawns a child process running `index.js`
- The parent CLI process stays alive to manage the child
- Press `CTRL+C` to gracefully shut down the server

**npm scripts:**
```bash
npm start              # Start with current config
npm run start:watch    # Start with auto-restart on file changes (nodemon)
```

### `show` - Display Configuration

Shows the current configuration from `config.json`.

```bash
node cli show
```

### `env` - Update Environment Settings

Modify the instance type or port number.

```bash
# Change instance
node cli env --instance=production

# Change port
node cli env --port=3000

# Change both
node cli env --instance=production --port=3000
```

### `validate` - Validate Configuration

Validates your `config.json` against the schema.

```bash
node cli validate
```

### `init` - Initialize Configuration

Creates a new `config.json` file with default settings.

```bash
node cli init

# Force overwrite existing config
node cli init --force
```

### `version` - Show Version

Displays the EspressoJS version.

```bash
node cli version
```

## Process Management

### Why the CLI Stays Alive

The CLI uses a parent-child process model:

1. **Parent Process (CLI)**: Manages the server lifecycle
2. **Child Process (Server)**: Runs the Express application

The parent process must stay alive to:
- Keep the child process running
- Handle graceful shutdown signals
- Monitor server health
- Provide process management

**Technical Implementation:**
```javascript
// The CLI keeps the process alive using:
process.stdin.resume();  // Prevents event loop from exiting

// Signal handlers ensure graceful shutdown:
process.on('SIGINT', () => {
  child.kill('SIGINT');
});
```

### Development vs Production

**Development (with auto-restart):**
```bash
npm run dev:watch
# or
npm run start:watch
```

Uses `nodemon` to automatically restart the server when files change.

**Production (stable):**
```bash
npm start
# or
node cli run
```

Runs the server without auto-restart for stability.

## npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node cli run` | Start server with current config |
| `start:watch` | `nodemon cli run` | Start with auto-restart |
| `dev` | Set dev config + run | Start in development mode |
| `dev:watch` | Set dev config + nodemon | Dev mode with auto-restart |
| `global` | Set global config + run | Start in global mode |
| `prod` | Set prod config + run | Start in production mode |
| `show` | `node cli show` | Display configuration |
| `validate` | `node cli validate` | Validate config.json |

## Troubleshooting

### Server Exits Immediately

**Problem:** Server starts but exits right away.

**Solution:** This is now fixed in v3.3.4+. The CLI uses `process.stdin.resume()` to keep the process alive.

**If still experiencing issues:**
```bash
# Option 1: Use nodemon
npm run start:watch

# Option 2: Run server directly (bypasses CLI)
node index.js
```

### Port Already in Use

**Problem:** `EADDRINUSE` error.

**Solution:**
```bash
# Change the port
node cli env --port=3001
node cli run
```

### Configuration Not Found

**Problem:** `config.json` missing.

**Solution:**
```bash
# Create new config
node cli init
```

### Process Won't Stop

**Problem:** Server doesn't respond to `CTRL+C`.

**Solution:**
```bash
# Force kill (find process ID first)
ps aux | grep node
kill -9 <PID>

# Or on Windows
tasklist | findstr node
taskkill /F /PID <PID>
```

## Best Practices

### 1. Use npm Scripts

Instead of running CLI commands directly, use npm scripts:

```bash
# Good
npm start

# Also good, but more verbose
node cli run
```

### 2. Development Workflow

```bash
# Initial setup
npm install
node cli init

# Start development
npm run dev:watch

# Test production config
npm run prod
```

### 3. Environment-Specific Configs

Create separate config files:
- `config.development.json`
- `config.production.json`
- `config.test.json`

Load them based on `NODE_ENV`:
```javascript
const env = process.env.NODE_ENV || 'development';
const config = require(`./config.${env}.json`);
```

### 4. Process Managers for Production

For production deployments, use a process manager:

**PM2:**
```bash
npm install -g pm2
pm2 start cli.js --name "espresso-app" -- run
pm2 save
pm2 startup
```

**Forever:**
```bash
npm install -g forever
forever start cli.js run
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "cli", "run"]
```

## Advanced Usage

### Custom CLI Scripts

You can extend the CLI in your own project:

```javascript
// custom-cli.js
const { spawn } = require('child_process');

// Custom command
if (process.argv[2] === 'custom') {
  console.log('Running custom command...');
  // Your custom logic
}

// Fall back to EspressoJS CLI
require('@misterzik/espressojs/cli');
```

### Programmatic Usage

Use EspressoJS programmatically without the CLI:

```javascript
const app = require('@misterzik/espressojs');
const config = require('@misterzik/espressojs/server');

// Your custom setup
app.use('/custom', (req, res) => {
  res.json({ message: 'Custom route' });
});

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Signal Handling

The CLI properly handles system signals:

| Signal | Behavior |
|--------|----------|
| `SIGINT` | Graceful shutdown (CTRL+C) |
| `SIGTERM` | Graceful shutdown (kill command) |
| `SIGKILL` | Immediate termination (cannot be caught) |

**Graceful Shutdown Process:**
1. Signal received by CLI
2. CLI forwards signal to child process
3. Server closes HTTP connections
4. MongoDB connections closed (if enabled)
5. Process exits with appropriate code

## FAQ

**Q: Why use the CLI instead of running `index.js` directly?**

A: The CLI provides:
- Configuration management
- Environment switching
- Validation
- Better error messages
- Process management

**Q: Can I use the CLI in production?**

A: Yes, but consider using a process manager (PM2, Forever) for:
- Auto-restart on crashes
- Load balancing
- Log management
- Monitoring

**Q: Does the CLI work on Windows?**

A: Yes, the CLI is cross-platform and works on Windows, macOS, and Linux.

**Q: How do I debug the CLI?**

A: Use Node.js debugging:
```bash
node --inspect cli run
```

Then open Chrome DevTools at `chrome://inspect`.

## Support

- **GitHub Issues**: https://github.com/misterzik/Espresso.js/issues
- **npm Package**: https://www.npmjs.com/package/@misterzik/espressojs
- **Documentation**: https://github.com/misterzik/Espresso.js

## Version History

- **v3.3.4**: Fixed CLI process management with `process.stdin.resume()`
- **v3.3.3**: Enhanced CLI output with emoji indicators
- **v3.3.2**: Improved error handling
- **v3.3.1**: Added multiple API support

---

**Happy coding with EspressoJS!** ☕
