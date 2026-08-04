/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso
 * Express Plug & Play Server
 * -----------------
 * @param {*} app - EspressoJS by Vimedev.com Labs
 */
require("dotenv").config();
const express = require("express");
const app = express();
const cfg = require("./server");
const { readConfigFile } = require("./server/utils/config.utils");
const { validateEnvVariables } = require("./server/utils/configValidator");
const logger = require("./server/utils/logger");
const APIManager = require("./server/utils/apiManager");
const pluginManager = require("./server/core/PluginManager");

const configData = readConfigFile();
const apiManager = new APIManager(configData);

const Cors = require("cors");
const Compression = require("compression");
const morgan = require("morgan");
const Routes = require("./routes/index");

const { helmetConfig } = require("./server/middleware/security");
const {
  errorHandler,
  notFoundHandler,
} = require("./server/middleware/errorHandler");
const {
  healthCheck,
  readinessCheck,
  livenessCheck,
} = require("./server/middleware/healthCheck");

const mongoDBPlugin = require("./server/plugins/mongodb.plugin");
const rateLimitPlugin = require("./server/plugins/ratelimit.plugin");
const securityPlugin = require("./server/plugins/security.plugin");
const ssrPlugin = require("./server/plugins/ssr.plugin");
const apiPlugin = require("./server/plugins/api.plugin");
const staticPlugin = require("./server/plugins/static.plugin");

const Port = configData.port || cfg.port;

validateEnvVariables();


const securityConfig = configData.security || {};
app.use(helmetConfig({
  strictCSP: securityConfig.strictCSP,
  disableCSP: securityConfig.disableCSP,
  cspDirectives: securityConfig.cspDirectives,
  ...securityConfig.helmet
}));
app.use(Compression());
app.use(Cors());
app.use(express.urlencoded({ extended: false, limit: "10mb", parameterLimit: 1000 }));
app.use(express.json({ limit: "10mb" }));

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

securityPlugin.initialize(app, {
  hpp: securityConfig.hpp !== false,
  mongoSanitize: securityConfig.mongoSanitize !== false,
  hppWhitelist: securityConfig.hppWhitelist || [],
});

rateLimitPlugin.initialize(app, {
  enabled: securityConfig.rateLimit?.enabled !== false,
  global: securityConfig.rateLimit?.global !== false,
  windowMs: securityConfig.rateLimit?.windowMs,
  max: securityConfig.rateLimit?.max,
  limiters: securityConfig.rateLimit?.limiters,
});

ssrPlugin.initialize(app, configData.features?.ssr || {});
apiPlugin.initialize(app, configData.features?.apiEnhancer || {});

app.get("/health", healthCheck);
app.get("/ready", readinessCheck);
app.get("/alive", livenessCheck);

staticPlugin.initialize(app, {
  publicDirectory: configData.publicDirectory || "public",
  maxAge: configData.staticFiles?.maxAge || "1d",
  etag: configData.staticFiles?.etag !== false,
  extensions: configData.staticFiles?.extensions || ["html"],
});

Routes(app);

app.use(notFoundHandler);
app.use(errorHandler);

let server;

const startServer = async () => {
  logger.info(`Attempting to start server on port ${Port}...`);
  
  try {
    await mongoDBPlugin.initialize(app, configData.mongoDB || {});
  } catch (error) {
    logger.error(`MongoDB initialization failed: ${error.message}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
  
  server = app.listen(Port, () => {
    const ssrStatus = configData.features?.ssr?.enabled ? "Enabled" : "Disabled";
    const apiDocsStatus = configData.features?.apiEnhancer?.documentation ? "Enabled" : "Disabled";
  
    logger.info(`
╔═══════════════════════════════════════════════════════╗
║                   ESPRESSO.JS v5.0.0                  ║
║           Plugin-Based Express Framework              ║
╠═══════════════════════════════════════════════════════╣
║  Environment: ${configData.instance.padEnd(39)} ║
║  Port:        ${Port.toString().padEnd(39)} ║
║  URL:         http://localhost:${Port.toString().padEnd(27)} ║
║  MongoDB:     ${(configData.mongoDB?.enabled ? "Enabled" : "Disabled").padEnd(39)} ║
║  API:         ${(configData.api?.enabled ? "Enabled" : "Disabled").padEnd(39)} ║
║  SSR:         ${ssrStatus.padEnd(39)} ║
║  API Docs:    ${apiDocsStatus.padEnd(39)} ║
╚═══════════════════════════════════════════════════════╝
    `);
  
  if (apiDocsStatus === "Enabled") {
    const docsUrl = `http://localhost:${Port}${configData.features.apiEnhancer.prefix}/docs`;
    logger.info(`API Documentation: ${docsUrl}`);
  }
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${Port} is already in use`);
    } else {
      logger.error(`Server error: ${error.message}`);
      logger.error(`Stack: ${error.stack}`);
    }
    process.exit(1);
  });
  
  server.on('listening', () => {
    logger.info(`Server is now listening on port ${Port}`);
  });
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info("HTTP server closed");
    
    try {
      await mongoDBPlugin.close();
    } catch (error) {
      logger.error(`Error closing MongoDB: ${error.message}`);
    }
    
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(`Stack: ${error.stack}`);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Auto-start server if run directly (not required as module)
if (require.main === module) {
  try {
    startServer();
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    process.exit(1);
  }
}

// Export app and utilities for programmatic usage
module.exports = app;
module.exports.apiManager = apiManager;
module.exports.pluginManager = pluginManager;
module.exports.plugins = {
  mongodb: mongoDBPlugin,
  rateLimit: rateLimitPlugin,
  security: securityPlugin,
  ssr: ssrPlugin,
  api: apiPlugin,
  static: staticPlugin,
};
module.exports.config = configData;
module.exports.startServer = startServer;
module.exports.gracefulShutdown = gracefulShutdown;
module.exports.server = server;
