# Changelog

All notable changes to EspressoJS will be documented in this file.

## [4.0.0] - 2024-01-15

### 🎉 Major Release - Modern, Secure, Feature-Rich

This is a major release with significant enhancements focused on security, SSR support, API improvements, and developer experience.

### ⚠️ Breaking Changes

- **Node.js Requirement**: Now requires Node.js >= 18.0.0 (previously >= 0.10.0)
- **Mongoose Options**: Removed deprecated `useNewUrlParser`, `useUnifiedTopology`, and `promiseLibrary` options
- **Package Updates**: All dependencies updated to latest secure versions

### 🔒 Security Enhancements

- **MongoDB Sanitization**: Added `express-mongo-sanitize` to prevent NoSQL injection attacks
- **HPP Protection**: Added `hpp` middleware to prevent HTTP Parameter Pollution
- **Enhanced Helmet**: Upgraded to v8.0.0 with stricter CSP policies
  - Configurable strict CSP mode for production
  - HSTS with preload support
  - Enhanced referrer policy
  - Frame protection
- **Secure MongoDB Connection**: Credentials now properly URL-encoded
- **Request Size Limits**: Added parameter limits (1000) to prevent DoS
- **Production Security**: Automatic strict mode in production environment
- **Input Validation**: Enhanced with express-validator v7.2.0

### 🎨 Server-Side Rendering (SSR)

- **Multiple Template Engines**: Support for EJS, Handlebars, and Pug
- **SSR Manager**: New `SSRManager` class for template management
- **Built-in Helpers**: Date formatting, JSON stringify, environment detection
- **Layout Support**: Master pages and partials
- **Production Caching**: Automatic template caching in production
- **View Middleware**: `res.renderView()` helper for easy rendering
- **SEO Ready**: Server-rendered HTML for better search engine optimization

### 🚀 API Enhancements

- **Swagger/OpenAPI**: Auto-generated interactive API documentation
  - Accessible at `/api/docs`
  - JSON spec at `/api/docs.json`
  - Customizable title and description
- **API Versioning**: Support for URL and header-based versioning
- **Response Formatting**: Standardized JSON responses
  - `res.success(data, message, statusCode)`
  - `res.error(message, statusCode, errors)`
  - `res.paginate(data, page, limit, total)`
- **Request Validation**: Built-in validation middleware
- **API Key Authentication**: Simple API key validation helper
- **CORS Configuration**: Fine-grained CORS control
- **Response Caching**: Cache-Control header helpers
- **Request Logging**: Enhanced API request logging

### 📦 New Dependencies

- `ejs` ^3.1.10 - EJS template engine
- `handlebars` ^4.7.8 - Handlebars template engine
- `pug` ^3.0.3 - Pug template engine
- `express-mongo-sanitize` ^2.2.0 - NoSQL injection prevention
- `hpp` ^0.2.3 - HTTP Parameter Pollution protection
- `swagger-jsdoc` ^6.2.8 - Swagger documentation generator
- `swagger-ui-express` ^5.0.1 - Swagger UI integration

### 📦 Updated Dependencies

- `express` 4.18.2 → 4.21.1 (security patches)
- `axios` 1.6.5 → 1.7.7 (security fixes)
- `mongoose` 8.0.4 → 8.8.3 (latest stable)
- `helmet` 7.1.0 → 8.0.0 (enhanced security)
- `winston` 3.11.0 → 3.17.0 (improved logging)
- `dotenv` 16.3.1 → 16.4.5 (latest stable)
- `express-rate-limit` 7.1.5 → 7.4.1 (improvements)
- `express-validator` 7.0.1 → 7.2.0 (new features)
- `joi` 17.12.0 → 17.13.3 (validation improvements)
- `serve-static` 1.15.0 → 1.16.2 (security)
- `@babel/core` 7.23.7 → 7.26.0 (latest)
- `@babel/preset-env` 7.23.7 → 7.26.0 (latest)
- `babel-loader` 9.1.3 → 9.2.1 (latest)
- `nodemon` 3.0.2 → 3.1.7 (latest)

### 📦 Removed Dependencies

- `bluebird` - No longer needed, using native Promises
- `finalhandler` - Redundant with Express built-in handling

### 🔧 Configuration System

- **New Features Section**: Organized feature toggles
  ```json
  {
    "features": {
      "ssr": { "enabled": false, "engine": "ejs" },
      "apiEnhancer": { "enabled": false, "documentation": false }
    }
  }
  ```
- **Security Configuration**: Centralized security settings
  ```json
  {
    "security": {
      "rateLimit": { "enabled": true, "max": 100 },
      "strictCSP": false
    }
  }
  ```
- **Backward Compatible**: Old config structure still works

### 🛠️ New Middleware

- `server/middleware/ssr.js` - SSR management
- `server/middleware/apiEnhancer.js` - API enhancements
- Enhanced `server/middleware/security.js`:
  - `hppProtection` - HPP middleware
  - `sanitizeData` - MongoDB sanitization
  - `createRateLimiter()` - Custom rate limiter factory

### 📝 Documentation

- **Strategy.md**: Comprehensive development strategy and roadmap
- **Claude.md**: AI assistant context and guidelines
- **docs/SSR-GUIDE.md**: Complete SSR implementation guide
- **docs/API-ENHANCEMENT.md**: API features and best practices
- **docs/SECURITY.md**: Security best practices and guidelines
- **MIGRATION-V4.md**: Detailed migration guide from v3.x

### 🎨 Examples & Templates

- `views/index.ejs` - Modern landing page template
- `views/error.ejs` - Error page template
- Example SSR implementations
- API documentation examples

### 🔄 Enhanced Features

- **Startup Banner**: Now shows SSR and API Docs status
- **Error Handling**: Better MongoDB connection error handling
- **Logging**: Enhanced security event logging
- **Exports**: Added `ssrManager` and `apiEnhancer` to module exports
- **Health Checks**: Improved health endpoint responses

### 🐛 Bug Fixes

- Fixed MongoDB credential exposure in connection string
- Fixed deprecated Mongoose connection options
- Improved error handling for missing views directory
- Better handling of missing configuration sections
- Fixed rate limiting configuration

### 📊 Performance Improvements

- Template caching in production
- Optimized middleware loading
- Reduced memory footprint
- Better request handling

### 🔐 Security Improvements

- All user inputs sanitized by default
- NoSQL injection prevention
- XSS protection enhanced
- CSRF token support ready
- Secure headers by default
- Production-ready security defaults

### 📚 Developer Experience

- Better error messages
- Comprehensive documentation
- Migration guide included
- Example implementations
- TypeScript definitions (coming soon)
- Interactive API documentation

### 🚀 Migration Path

See [MIGRATION-V4.md](./MIGRATION-V4.md) for detailed migration instructions.

**Quick Migration**:
1. Update Node.js to v18+
2. Run `npm install`
3. Update `config.json` (optional, backward compatible)
4. Test your application
5. Enable new features as needed

### 📦 npm Scripts

- Added `audit` - Run npm audit on production dependencies
- Added `audit:fix` - Automatically fix vulnerabilities

### 🎯 Future Roadmap

- TypeScript definitions
- GraphQL integration
- WebSocket support
- Plugin system
- Hot reload in development
- More template engines
- Advanced caching strategies

## [3.3.6] - 2024-12-25

### Fixed
- **Critical**: API routes now load correctly from `routes/api/index.js`
- API routes properly mounted at root level to support `/v1/` endpoints
- Catch-all route moved to end to prevent intercepting API routes
- Route loading path corrected to use proper file structure
- Programmatic usage now properly supported with exported `startServer()` function

### Changed
- Replaced static version badge with dynamic npm version shield badge
- Updated landing page to show live npm version from shields.io
- Improved code formatting and whitespace consistency in HTML files
- Updated default API URI to use swapi.info instead of swapi.dev
- Enhanced module exports for better programmatic usage

### Added
- Dynamic version badge using shields.io npm API
- Better visual indication of current package version on landing page
- Exported `startServer()` function for programmatic usage
- Exported `gracefulShutdown()` function for custom shutdown handling
- Exported `server` instance for advanced use cases
- Comprehensive usage patterns documentation (docs/USAGE-PATTERNS.md)
- README section explaining different server startup methods

### Documentation
- Added detailed guide explaining why some users need manual `app.listen()`
- Documented three usage patterns: CLI, Direct Execution, and Programmatic
- Explained `require.main === module` behavior and implications
- Migration guide from manual listen to `startServer()` function

## [3.3.5] - 2024-12-25

### Fixed
- **Critical**: CLI process management - added `process.stdin.resume()` to keep parent process alive
- Server now stays running properly when using `node cli run`
- Event loop properly maintained for child process management

### Added
- Comprehensive CLI usage documentation (docs/CLI-USAGE.md)
- `start:watch` npm script for auto-restart with nodemon
- `dev:watch` npm script for development with auto-restart
- `validate` npm script for configuration validation
- Detailed process management documentation

### Changed
- Enhanced signal handling (SIGINT/SIGTERM) for graceful shutdown
- Improved CLI process lifecycle management
- Updated README with npm scripts section and process management explanation

### Dependencies
- Added nodemon ^3.0.2 as devDependency for development auto-restart

## [3.3.4] - 2024-12-24

### Added
- Modern landing page UI with gradient background and glassmorphism design
- Feature showcase grid with 6 interactive cards
- Animated coffee icon with floating effect
- Call-to-action buttons for GitHub and npm
- Version badge display on landing page
- Responsive design for mobile and tablet devices
- Comprehensive CLI usage documentation (docs/CLI-USAGE.md)
- `start:watch` and `dev:watch` npm scripts for auto-restart with nodemon
- `validate` npm script for config validation

### Changed
- Completely redesigned public/index.html with modern aesthetics
- Enhanced CLI output with emoji indicators and cleaner formatting
- Improved CLI startup banner with better information display
- Updated demo/public/index.html to match new design
- Updated demo/config.json with new schema (publicDirectory, timeout, retries)
- Updated demo/espresso.js to use APIManager instead of direct axios

### Fixed
- **Critical**: CLI process now stays alive after spawning server using `process.stdin.resume()`
- Server startup process properly maintains event loop
- Better signal handling (SIGINT/SIGTERM) for graceful shutdown
- CLI no longer exits prematurely when running `node cli run`

### Dependencies
- Added nodemon ^3.0.2 as devDependency for development auto-restart

## [3.3.3] - 2024-12-24

### Fixed
- Server startup crash when favicon or public directory missing
- Configuration property names in routes (api.enabled, mongoDB.enabled)
- Public directory path handling (supports both absolute and relative paths)
- CLI spawn process simplified (removed cross-env dependency)
- Enhanced error logging with stack traces

### Changed
- Updated dependencies to latest stable versions
- Replaced deprecated babel-preset-env with @babel/preset-env
- Made favicon and static file serving optional with graceful fallbacks

### Security
- Fixed 22 critical vulnerabilities by updating Babel dependencies
- Updated axios, joi, and mongoose to latest versions

## [3.3.2] - 2024-12-24

### Fixed
- Package publishing configuration
- Updated .npmignore to exclude development files

## [3.3.1] - 2024-01-01

### Added
- **Multiple API Endpoints Support**
  - Configure unlimited API endpoints using `api`, `api2`, `api3`, etc. pattern
  - New `APIManager` class for managing multiple APIs
  - Support for per-API timeout and retry configuration
  - Automatic retry with exponential backoff
  - API health checking and fallback patterns
  - Comprehensive documentation in `docs/MULTIPLE-APIS.md`
  - Example implementation in `examples/multiple-apis.js`

- **Configuration Enhancements**
  - Added `publicDirectory` option to customize static files location
  - Added `timeout` option for API requests (default: 30000ms)
  - Added `retries` option for automatic retry (0-5 attempts)
  - Support for HEAD and OPTIONS HTTP methods
  - Unknown configuration keys now allowed for flexibility

- **API Manager Features**
  - `request(apiName, endpoint, options)` - Make API requests
  - `getAPI(name)` - Get specific API configuration
  - `getAllAPIs()` - List all configured APIs
  - `hasAPI(name)` - Check API availability
  - `createAxiosInstance(apiName)` - Create custom Axios client

### Changed
- Configuration validator now supports dynamic API endpoints
- Static file serving now uses `publicDirectory` from config
- Exported `apiManager` and `config` from main module

### Fixed
- Configuration validation now properly handles multiple API endpoints
- Better error messages for API configuration issues

## [3.3.0] - 2024-01-01

### Added
- **Security Enhancements**
  - Helmet.js integration for secure HTTP headers
  - Express rate limiting to prevent abuse
  - Enhanced CORS configuration
  - Content Security Policy (CSP) headers

- **Advanced Logging**
  - Winston logger with multiple transports
  - File-based logging (combined, error, exceptions, rejections)
  - Colored console output
  - HTTP request logging with Morgan

- **Error Handling**
  - Centralized error handling middleware
  - Custom AppError class for operational errors
  - Async error handler wrapper
  - 404 not found handler
  - Graceful error responses

- **Health Monitoring**
  - `/health` endpoint with system metrics
  - `/ready` readiness probe
  - `/alive` liveness probe
  - Memory and CPU usage reporting
  - Database connection status

- **Configuration Management**
  - Joi-based configuration validation
  - Default configuration fallback
  - Enhanced error handling for config files
  - Environment variable validation

- **CLI Improvements**
  - `init` command to create config.json
  - `validate` command to check configuration
  - `version` command for version info
  - Better error messages and formatting
  - Command help system

- **Graceful Shutdown**
  - SIGTERM and SIGINT handling
  - Proper cleanup of MongoDB connections
  - HTTP server graceful close
  - Timeout-based forced shutdown

- **Developer Experience**
  - Better startup banner with configuration info
  - Improved error messages
  - Enhanced documentation
  - Request body size limits (10mb)

### Changed
- Updated dependencies to latest versions
- Improved MongoDB connection handling
- Enhanced route loading with error handling
- Better default responses for missing files
- Modernized CLI with spawn instead of exec

### Fixed
- Configuration file reading errors
- MongoDB connection error handling
- Route loading failures
- Missing file handling

## [3.2.6] - 2023-07-01

### Initial Release
- Basic Express server setup
- MongoDB integration
- Configuration management
- CLI tools
- Static file serving
- CORS and compression support
