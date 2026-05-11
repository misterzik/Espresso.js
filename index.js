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
const {
  readConfigFile,
  setCustomCacheControl,
} = require("./server/utils/config.utils");
const { validateEnvVariables } = require("./server/utils/configValidator");
const logger = require("./server/utils/logger");
const APIManager = require("./server/utils/apiManager");
const { createSSRManager } = require("./server/middleware/ssr");
const { createAPIEnhancer } = require("./server/middleware/apiEnhancer");
const configData = readConfigFile();
const apiManager = new APIManager(configData);
const ssrManager = configData.features?.ssr ? createSSRManager(configData.features.ssr) : null;
const apiEnhancer = configData.features?.apiEnhancer ? createAPIEnhancer(configData.features.apiEnhancer) : null;

const Path = require("path");
const Cors = require("cors");
const Compression = require("compression");
const Favicon = require("serve-favicon");
const Static = require("serve-static");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Routes = require("./routes/index");

const {
  helmetConfig,
  rateLimiter,
  hppProtection,
  sanitizeData,
} = require("./server/middleware/security");
const {
  errorHandler,
  notFoundHandler,
} = require("./server/middleware/errorHandler");
const {
  healthCheck,
  readinessCheck,
  livenessCheck,
} = require("./server/middleware/healthCheck");

const Port = configData.port || cfg.port;
const mongoConfig = configData.mongoDB;
const rootDir = process.cwd();
const publicDir = configData.publicDirectory || "public";
const publicPath = publicDir.startsWith('/') || publicDir.startsWith('\\') 
  ? publicDir.substring(1) 
  : publicDir;

validateEnvVariables();

if (configData.mongoDB.enabled) {
  const {
    uri: mongoUri = configData.mongoDB.uri || "",
    port: mongoPort = configData.mongoDB.port || "",
    db: mongoDb = configData.mongoDB.instance || "",
  } = mongoConfig;
  
  if (!process.env.MONGO_USER || !process.env.MONGO_TOKEN) {
    logger.error("MongoDB credentials not found in environment variables");
    logger.error("Please set MONGO_USER and MONGO_TOKEN in .env file");
    process.exit(1);
  }
  
  const hasPort = mongoPort ? `:${mongoPort}/` : "/";
  const credentials = `${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_TOKEN)}`;
  const url = `mongodb+srv://${credentials}@${mongoUri}${hasPort}${mongoDb}`;

  mongoose.Promise = global.Promise;
  mongoose
    .connect(url)
    .then(() => logger.info(":: DB Connection successful ::"))
    .catch((err) => {
      logger.error(`DB Connection error: ${err.message}`);
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      }
    });
}

const securityConfig = configData.security || {};
app.use(helmetConfig({ strictCSP: securityConfig.strictCSP }));
app.use(Compression());
app.use(Cors());
app.use(express.urlencoded({ extended: false, limit: "10mb", parameterLimit: 1000 }));
app.use(express.json({ limit: "10mb" }));
app.use(sanitizeData);
app.use(hppProtection);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

if (securityConfig.rateLimit?.enabled !== false) {
  app.use(rateLimiter);
}

if (ssrManager) {
  ssrManager.initialize(app);
  app.use(ssrManager.middleware());
}

if (apiEnhancer) {
  app.use(apiEnhancer.responseFormatter());
  app.use(apiEnhancer.versioningMiddleware());
  apiEnhancer.setupSwagger(app);
}

app.get("/health", healthCheck);
app.get("/ready", readinessCheck);
app.get("/alive", livenessCheck);

const fs = require("fs");
const faviconPath = Path.join(rootDir, publicPath, "favicon.ico");
if (fs.existsSync(faviconPath)) {
  app.use(Favicon(faviconPath));
} else {
  logger.warn(`Favicon not found at ${faviconPath}, skipping...`);
}

const staticPath = Path.join(rootDir, publicPath);
if (fs.existsSync(staticPath)) {
  app.use(
    Static(staticPath, {
      maxAge: "1d",
      setHeaders: setCustomCacheControl,
      etag: true,
      extensions: "error.html",
    })
  );
  logger.info(`Static files served from: ${staticPath}`);
} else {
  logger.warn(`Public directory not found at ${staticPath}, skipping static file serving...`);
}

Routes(app);

app.use(notFoundHandler);
app.use(errorHandler);

let server;

const startServer = () => {
  logger.info(`Attempting to start server on port ${Port}...`);
  
  server = app.listen(Port, () => {
    const ssrStatus = configData.features?.ssr?.enabled ? "Enabled" : "Disabled";
  const apiDocsStatus = configData.features?.apiEnhancer?.documentation ? "Enabled" : "Disabled";
  
  logger.info(`
╔═══════════════════════════════════════════════════════╗
║                   ESPRESSO.JS v4.0.0                  ║
║              Express Boilerplate Server               ║
╠═══════════════════════════════════════════════════════╣
║  Environment: ${configData.instance.padEnd(39)} ║
║  Port:        ${Port.toString().padEnd(39)} ║
║  URL:         http://localhost:${Port.toString().padEnd(27)} ║
║  MongoDB:     ${(configData.mongoDB.enabled ? "Enabled" : "Disabled").padEnd(39)} ║
║  API:         ${(configData.api.enabled ? "Enabled" : "Disabled").padEnd(39)} ║
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

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info("HTTP server closed");
    
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(false, () => {
        logger.info("MongoDB connection closed");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
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
module.exports.ssrManager = ssrManager;
module.exports.apiEnhancer = apiEnhancer;
module.exports.config = configData;
module.exports.startServer = startServer;
module.exports.gracefulShutdown = gracefulShutdown;
module.exports.server = server;
