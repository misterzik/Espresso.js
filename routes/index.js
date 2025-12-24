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
const configuration = require("../server");
const logger = require("../server/utils/logger");
const { asyncHandler } = require("../server/middleware/errorHandler");
const rootDir = process.cwd();

module.exports = (app) => {
  app.get(
    "/",
    asyncHandler(async (req, res) => {
      const filePath = path.join(rootDir, "public", "index.html");
      
      if (!fs.existsSync(filePath)) {
        logger.warn("index.html not found, sending default response");
        return res.status(200).json({
          message: "Welcome to EspressoJS",
          version: "3.2.6",
          documentation: "https://github.com/misterzik/Espresso.js",
        });
      }
      
      res.sendFile(filePath);
    })
  );

  if (configuration.api_isEnabled === true) {
    try {
      const apiRoutes = require(path.join(rootDir, "routes", "api.js"));
      app.use("/api", apiRoutes);
      logger.info("API routes loaded successfully");
    } catch (error) {
      logger.warn(`API routes not found or failed to load: ${error.message}`);
    }
  }

  if (configuration.mongo_isEnabled === true) {
    try {
      const dbRoutes = require(path.join(rootDir, "routes", "db.js"));
      app.use("/api/db", dbRoutes);
      logger.info("Database routes loaded successfully");
    } catch (error) {
      logger.warn(`Database routes not found or failed to load: ${error.message}`);
    }
  }

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
