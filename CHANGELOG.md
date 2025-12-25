# Changelog

All notable changes to EspressoJS will be documented in this file.

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
