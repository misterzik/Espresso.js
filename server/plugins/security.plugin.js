/*
 * EspressoJS - Security Plugin
 * Optional security enhancements (HPP, Mongo Sanitize)
 */

const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class SecurityPlugin {
  constructor() {
    this.hpp = null;
    this.mongoSanitize = null;
  }

  initialize(app, config = {}) {
    const middlewares = [];

    // HPP Protection
    if (config.hpp !== false) {
      this.hpp = pluginManager.safeRequire("hpp");
      if (this.hpp) {
        const hppMiddleware = this.hpp({
          whitelist: config.hppWhitelist || [],
        });
        app.use(hppMiddleware);
        middlewares.push("HPP Protection");
      } else {
        logger.info("hpp not installed, skipping HPP protection");
        logger.info("Install with: npm install hpp");
      }
    }

    // MongoDB Sanitization
    if (config.mongoSanitize !== false) {
      this.mongoSanitize = pluginManager.safeRequire("express-mongo-sanitize");
      if (this.mongoSanitize) {
        const sanitizeMiddleware = this.mongoSanitize({
          replaceWith: "_",
          onSanitize: ({ req, key }) => {
            logger.warn(`Sanitized potentially malicious data in ${key}`);
          },
        });
        app.use(sanitizeMiddleware);
        middlewares.push("NoSQL Injection Protection");
      } else {
        logger.info("express-mongo-sanitize not installed, skipping NoSQL injection protection");
        logger.info("Install with: npm install express-mongo-sanitize");
      }
    }

    if (middlewares.length > 0) {
      logger.info(`Security enhancements enabled: ${middlewares.join(", ")}`);
    }
  }
}

module.exports = new SecurityPlugin();
