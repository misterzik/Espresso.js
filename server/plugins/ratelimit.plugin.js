/*
 * EspressoJS - Rate Limiting Plugin
 * Optional rate limiting middleware
 */

const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class RateLimitPlugin {
  constructor() {
    this.rateLimit = null;
    this.limiters = {};
  }

  initialize(app, config = {}) {
    if (config.enabled === false) {
      logger.info("Rate limiting plugin is disabled");
      return;
    }

    // Check if express-rate-limit is available
    this.rateLimit = pluginManager.safeRequire("express-rate-limit");

    if (!this.rateLimit) {
      logger.warn("express-rate-limit not installed, rate limiting disabled");
      logger.info("Install with: npm install express-rate-limit");
      return;
    }

    // Create default rate limiter
    const defaultConfig = {
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      max: config.max || 100,
      message: config.message || "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    };

    this.limiters.default = this.rateLimit(defaultConfig);

    // Apply to app if not custom routes
    if (config.global !== false) {
      app.use(this.limiters.default);
      logger.info(`Rate limiting enabled: ${defaultConfig.max} requests per ${defaultConfig.windowMs / 1000}s`);
    }

    // Create additional limiters if specified
    if (config.limiters) {
      Object.entries(config.limiters).forEach(([name, limiterConfig]) => {
        this.limiters[name] = this.rateLimit({
          ...defaultConfig,
          ...limiterConfig,
        });
        logger.info(`Custom rate limiter '${name}' created`);
      });
    }

    // Store limiters on app for access
    app.locals.rateLimiters = this.limiters;
  }

  getLimiter(name = "default") {
    return this.limiters[name] || this.limiters.default;
  }

  createLimiter(options = {}) {
    if (!this.rateLimit) {
      return (req, res, next) => next();
    }
    return this.rateLimit(options);
  }
}

module.exports = new RateLimitPlugin();
