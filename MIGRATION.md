# Migration Guide

This guide helps you upgrade your EspressoJS application to the latest version.

## Upgrading to v3.3.0

### What's New?

EspressoJS v3.3.0 introduces modern security, logging, error handling, and monitoring features while maintaining **100% backward compatibility** with v3.2.6.

### Step 1: Update Dependencies

```bash
npm install @misterzik/espressojs@latest
```

This will install all new dependencies automatically:
- helmet (security)
- morgan (HTTP logging)
- winston (application logging)
- express-rate-limit (rate limiting)
- express-validator (validation)
- joi (configuration validation)

### Step 2: Verify Configuration

Your existing `config.json` will continue to work. To validate it:

```bash
node cli validate
```

If you see any validation errors, the CLI will guide you on how to fix them.

### Step 3: Optional Enhancements

#### Use Health Check Endpoints

Add health monitoring to your infrastructure:

```bash
# Check server health
curl http://localhost:8080/health

# Kubernetes readiness probe
curl http://localhost:8080/ready

# Kubernetes liveness probe
curl http://localhost:8080/alive
```

#### Use the Logger

Replace `console.log` with the new Winston logger:

```javascript
// Old way
console.log('Server started');
console.error('Error occurred');

// New way
const logger = require('./server/utils/logger');
logger.info('Server started');
logger.error('Error occurred');
```

#### Use Error Handling Middleware

Wrap async routes with `asyncHandler`:

```javascript
const { asyncHandler, AppError } = require('./server/middleware/errorHandler');

// Old way
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New way
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
}));
```

#### Use New CLI Commands

```bash
# Initialize new config
node cli init

# Show version
node cli version

# Validate config
node cli validate
```

### Step 4: Review Logs

The new logging system creates a `logs/` directory with:
- `combined.log` - All logs
- `error.log` - Errors only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled rejections

Add `logs/` to your `.gitignore` if not already present.

### Step 5: Update Monitoring (Optional)

If you use monitoring tools, add the new health endpoints:

**Kubernetes:**
```yaml
livenessProbe:
  httpGet:
    path: /alive
    port: 8080
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
```

**Docker Compose:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Breaking Changes

### None!

All changes in v3.3.0 are backward compatible. Your existing code will continue to work without modifications.

## New Features You Get Automatically

Even without code changes, you automatically get:

✅ **Security**: Helmet.js protection, rate limiting, enhanced CORS  
✅ **Logging**: Winston logger with file and console output  
✅ **Error Handling**: Centralized error handling  
✅ **Health Checks**: `/health`, `/ready`, `/alive` endpoints  
✅ **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT  
✅ **Better Startup**: Enhanced startup banner with config info  
✅ **Request Limits**: 10MB body size limit to prevent abuse  

## Troubleshooting

### Issue: "Cannot find module 'helmet'"

**Solution**: Run `npm install` to install new dependencies.

### Issue: Logs directory errors

**Solution**: The logs directory is created automatically. Ensure write permissions.

### Issue: Rate limiting too strict

**Solution**: Customize rate limits in your code:

```javascript
const { apiRateLimiter } = require('./server/middleware/security');
app.use('/api', apiRateLimiter);
```

### Issue: Health check returns 503

**Solution**: This is normal if MongoDB is enabled but not connected. Check your MongoDB configuration.

## Rollback

If you need to rollback to v3.2.6:

```bash
npm install @misterzik/espressojs@3.2.6
```

## Getting Help

- [GitHub Issues](https://github.com/misterzik/Espresso.js/issues)
- [Documentation](https://github.com/misterzik/Espresso.js)
- [Examples](./examples/)

## Next Steps

1. Review the [CHANGELOG.md](./CHANGELOG.md) for detailed changes
2. Check out [examples/](./examples/) for code samples
3. Read the updated [README.md](./README.md) for full documentation
4. See [ENHANCEMENTS.md](./ENHANCEMENTS.md) for technical details

Happy upgrading! ☕
