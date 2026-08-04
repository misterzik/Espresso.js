/*
 * EspressoJS - API Enhancement Plugin
 * Advanced API features: Swagger, Validation, Versioning, Response Formatting
 */

const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class APIPlugin {
  constructor() {
    this.enabled = false;
    this.swaggerJsdoc = null;
    this.swaggerUi = null;
    this.expressValidator = null;
  }

  initialize(app, config = {}) {
    if (!config.enabled) {
      logger.info("API enhancement plugin is disabled");
      return;
    }

    this.enabled = true;
    this.versioning = config.versioning || false;
    this.documentation = config.documentation || false;
    this.prefix = config.prefix || "/api";
    this.version = config.version || "v1";
    this.title = config.title || "Espresso.js API";
    this.description = config.description || "API documentation for Espresso.js application";

    // Add response formatters
    app.use(this.responseFormatter());

    // Add versioning middleware
    if (this.versioning) {
      app.use(this.versioningMiddleware());
      logger.info("API versioning enabled");
    }

    // Setup Swagger documentation
    if (this.documentation) {
      this.setupSwagger(app, config);
    }

    // Load express-validator if available
    this.expressValidator = pluginManager.safeRequire("express-validator");
    if (this.expressValidator) {
      app.locals.validator = this.expressValidator;
      logger.info("Express-validator available for request validation");
    }

    logger.info("API enhancement plugin initialized");
  }

  setupSwagger(app, config) {
    this.swaggerJsdoc = pluginManager.safeRequire("swagger-jsdoc");
    this.swaggerUi = pluginManager.safeRequire("swagger-ui-express");

    if (!this.swaggerJsdoc || !this.swaggerUi) {
      logger.warn("Swagger dependencies not installed, documentation disabled");
      logger.info("Install with: npm install swagger-jsdoc swagger-ui-express");
      return;
    }

    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: this.title,
          version: this.version,
          description: this.description,
          contact: {
            name: config.contact?.name || "API Support",
            email: config.contact?.email || "",
            url: config.contact?.url || "",
          },
          license: {
            name: config.license?.name || "MIT",
            url: config.license?.url || "",
          },
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT || 8080}${this.prefix}`,
            description: "Development server",
          },
          ...(config.servers || []),
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            apiKey: {
              type: "apiKey",
              in: "header",
              name: "X-API-Key",
            },
          },
          schemas: config.schemas || {},
        },
      },
      apis: config.apiPaths || ["./routes/**/*.js", "./server/controllers/**/*.js"],
    };

    const swaggerSpec = this.swaggerJsdoc(swaggerOptions);

    app.use(`${this.prefix}/docs`, this.swaggerUi.serve);
    app.get(`${this.prefix}/docs`, this.swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: this.title,
      swaggerOptions: {
        persistAuthorization: true,
      },
    }));

    app.get(`${this.prefix}/docs.json`, (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    logger.info(`API documentation available at ${this.prefix}/docs`);
  }

  validationMiddleware() {
    if (!this.expressValidator) {
      return (req, res, next) => next();
    }

    const { validationResult } = this.expressValidator;

    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value,
          })),
        });
      }
      next();
    };
  }

  versioningMiddleware() {
    return (req, res, next) => {
      const version = req.headers["api-version"] || 
                     req.query.version || 
                     this.version;

      req.apiVersion = version;
      res.setHeader("X-API-Version", version);
      next();
    };
  }

  responseFormatter() {
    return (req, res, next) => {
      res.success = (data, message = "Success", statusCode = 200) => {
        res.status(statusCode).json({
          status: "success",
          message,
          data,
          timestamp: new Date().toISOString(),
        });
      };

      res.error = (message = "Error", statusCode = 500, errors = null) => {
        const response = {
          status: "error",
          message,
          timestamp: new Date().toISOString(),
        };

        if (errors) {
          response.errors = errors;
        }

        res.status(statusCode).json(response);
      };

      res.paginate = (data, page = 1, limit = 10, total = 0) => {
        const totalPages = Math.ceil(total / limit);
        
        res.status(200).json({
          status: "success",
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          timestamp: new Date().toISOString(),
        });
      };

      next();
    };
  }

  apiKeyAuth(validKeys = []) {
    return (req, res, next) => {
      const apiKey = req.headers["x-api-key"] || req.query.apiKey;

      if (!apiKey) {
        return res.status(401).json({
          status: "error",
          message: "API key is required",
        });
      }

      if (validKeys.length > 0 && !validKeys.includes(apiKey)) {
        return res.status(403).json({
          status: "error",
          message: "Invalid API key",
        });
      }

      req.apiKey = apiKey;
      next();
    };
  }

  cacheControl(duration = 300) {
    return (req, res, next) => {
      if (req.method === "GET") {
        res.setHeader("Cache-Control", `public, max-age=${duration}`);
      } else {
        res.setHeader("Cache-Control", "no-store");
      }
      next();
    };
  }
}

module.exports = new APIPlugin();
