/*
 * EspressoJS - Static Files Plugin
 * Optional static file serving with favicon support
 */

const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class StaticPlugin {
  initialize(app, config = {}) {
    const rootDir = process.cwd();
    const publicDir = config.publicDirectory || "public";
    const publicPath = publicDir.startsWith('/') || publicDir.startsWith('\\') 
      ? publicDir.substring(1) 
      : publicDir;

    // Serve favicon if available
    const Favicon = pluginManager.safeRequire("serve-favicon");
    if (Favicon) {
      const faviconPath = path.join(rootDir, publicPath, "favicon.ico");
      if (fs.existsSync(faviconPath)) {
        app.use(Favicon(faviconPath));
        logger.info("Favicon served");
      }
    }

    // Serve static files
    const Static = pluginManager.safeRequire("serve-static");
    if (Static) {
      const staticPath = path.join(rootDir, publicPath);
      if (fs.existsSync(staticPath)) {
        app.use(
          Static(staticPath, {
            maxAge: config.maxAge || "1d",
            setHeaders: this.setCustomCacheControl,
            etag: config.etag !== false,
            extensions: config.extensions || ["html"],
          })
        );
        logger.info(`Static files served from: ${staticPath}`);
      } else {
        logger.warn(`Public directory not found at ${staticPath}`);
      }
    } else {
      logger.info("serve-static not installed, using express.static");
      const staticPath = path.join(rootDir, publicPath);
      if (fs.existsSync(staticPath)) {
        const express = require("express");
        app.use(express.static(staticPath, {
          maxAge: config.maxAge || "1d",
          etag: config.etag !== false,
        }));
        logger.info(`Static files served from: ${staticPath} (using express.static)`);
      }
    }
  }

  setCustomCacheControl(res, path) {
    if (path.endsWith(".html")) {
      res.setHeader("Cache-Control", "public, max-age=0");
    } else if (path.match(/\.(css|js)$/)) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
      res.setHeader("Cache-Control", "public, max-age=2592000");
    }
  }
}

module.exports = new StaticPlugin();
