/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Routes Control
 * ----
 * @param {*} app - Vimedev.com Labs
 */

const path = require("path");
const fs = require("fs");
const { readConfigFile } = require("../server/utils/config.utils");
const logger = require("../server/utils/logger");
const { asyncHandler } = require("../server/middleware/errorHandler");
const rootDir = process.cwd();
const configuration = readConfigFile();

module.exports = (app) => {
  app.get(
    "/",
    asyncHandler(async (req, res) => {
      const filePath = path.join(rootDir, "public", "index.html");
      
      if (!fs.existsSync(filePath)) {
        logger.warn("index.html not found, sending default response");
        return res.status(200).json({
          message: "Welcome to EspressoJS",
          version: "3.3.2",
          documentation: "https://github.com/misterzik/Espresso.js",
        });
      }
      
      res.sendFile(filePath);
    })
  );

  if (configuration.api && configuration.api.enabled === true) {
    try {
      const apiRoutes = require(path.join(rootDir, "routes", "api", "index.js"));
      app.use("/", apiRoutes.router);
      logger.info("API routes loaded successfully");
    } catch (error) {
      logger.warn(`API routes not found or failed to load: ${error.message}`);
    }
  }

  if (configuration.mongoDB && configuration.mongoDB.enabled === true) {
    try {
      const dbRoutes = require(path.join(rootDir, "routes", "db.js"));
      app.use("/api/db", dbRoutes);
      logger.info("Database routes loaded successfully");
    } catch (error) {
      logger.warn(`Database routes not found or failed to load: ${error.message}`);
    }
  }

  // Catch-all route must be last to avoid intercepting API routes
  app.get(
    "/*",
    asyncHandler(async (req, res) => {
      const filePath = path.join(rootDir, "public", "index.html");
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          status: "error",
          message: "Page not found",
        });
      }
      
      res.sendFile(filePath);
    })
  );
};
