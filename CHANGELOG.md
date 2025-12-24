# Changelog

All notable changes to EspressoJS will be documented in this file.

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
