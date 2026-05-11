/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - API Enhancement Middleware
 */

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

class APIEnhancer {
  constructor(config = {}) {
    this.enabled = config.enabled || false;
    this.versioning = config.versioning || false;
    this.documentation = config.documentation || false;
    this.prefix = config.prefix || "/api";
    this.version = config.version || "v1";
    this.title = config.title || "Espresso.js API";
    this.description = config.description || "API documentation for Espresso.js application";
  }

  setupSwagger(app) {
    if (!this.documentation) {
      logger.info("API documentation is disabled");
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
            name: "API Support",
          },
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT || 8080}${this.prefix}`,
            description: "Development server",
          },
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
        },
      },
      apis: ["./routes/**/*.js", "./server/controllers/**/*.js"],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    app.use(`${this.prefix}/docs`, swaggerUi.serve);
    app.get(`${this.prefix}/docs`, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: this.title,
    }));

    app.get(`${this.prefix}/docs.json`, (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    logger.info(`API documentation available at ${this.prefix}/docs`);
  }

  validationMiddleware() {
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
      if (!this.versioning) {
        return next();
      }

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

  requestLogger() {
    return (req, res, next) => {
      const startTime = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - startTime;
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
      });

      next();
    };
  }

  corsConfig(options = {}) {
    return (req, res, next) => {
      const allowedOrigins = options.origins || ["*"];
      const origin = req.headers.origin;

      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
      }

      res.setHeader("Access-Control-Allow-Methods", options.methods || "GET,POST,PUT,DELETE,PATCH,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", options.headers || "Content-Type,Authorization,X-API-Key");
      res.setHeader("Access-Control-Allow-Credentials", options.credentials || "true");

      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }

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

const createAPIEnhancer = (config) => {
  return new APIEnhancer(config);
};

module.exports = {
  APIEnhancer,
  createAPIEnhancer,
};
