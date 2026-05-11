/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Server-Side Rendering Middleware
 */

const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

class SSRManager {
  constructor(config = {}) {
    this.enabled = config.enabled || false;
    this.engine = config.engine || "ejs";
    this.viewsDir = config.viewsDir || "views";
    this.cache = config.cache !== undefined ? config.cache : process.env.NODE_ENV === "production";
    this.layout = config.layout || null;
    this.helpers = config.helpers || {};
    this.app = null;
  }

  initialize(app) {
    if (!this.enabled) {
      logger.info("SSR is disabled");
      return;
    }

    this.app = app;
    const rootDir = process.cwd();
    const viewsPath = path.join(rootDir, this.viewsDir);

    if (!fs.existsSync(viewsPath)) {
      logger.warn(`Views directory not found at ${viewsPath}, creating...`);
      fs.mkdirSync(viewsPath, { recursive: true });
    }

    app.set("views", viewsPath);
    app.set("view engine", this.engine);
    app.set("view cache", this.cache);

    this.setupEngine(app);
    this.registerHelpers(app);

    logger.info(`SSR initialized with ${this.engine} engine`);
    logger.info(`Views directory: ${viewsPath}`);
    logger.info(`View caching: ${this.cache ? "enabled" : "disabled"}`);
  }

  setupEngine(app) {
    switch (this.engine) {
      case "ejs":
        app.set("view options", {
          rmWhitespace: true,
          cache: this.cache,
        });
        break;

      case "handlebars":
        const handlebars = require("handlebars");
        const exphbs = require("express-handlebars");
        
        const hbs = exphbs.create({
          defaultLayout: this.layout || false,
          extname: ".hbs",
          layoutsDir: path.join(process.cwd(), this.viewsDir, "layouts"),
          partialsDir: path.join(process.cwd(), this.viewsDir, "partials"),
          helpers: this.helpers,
        });

        app.engine("hbs", hbs.engine);
        app.set("view engine", "hbs");
        break;

      case "pug":
        app.locals.basedir = path.join(process.cwd(), this.viewsDir);
        break;

      default:
        logger.warn(`Unknown template engine: ${this.engine}, defaulting to EJS`);
        this.engine = "ejs";
    }
  }

  registerHelpers(app) {
    app.locals.helpers = this.helpers;
    
    app.locals.formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    app.locals.json = (obj) => {
      return JSON.stringify(obj, null, 2);
    };

    app.locals.env = process.env.NODE_ENV || "development";
    app.locals.isDevelopment = process.env.NODE_ENV === "development";
    app.locals.isProduction = process.env.NODE_ENV === "production";
  }

  render(view, data = {}, options = {}) {
    return (req, res, next) => {
      const renderData = {
        ...data,
        ...options,
        req,
        user: req.user || null,
        query: req.query,
        params: req.params,
      };

      res.render(view, renderData, (err, html) => {
        if (err) {
          logger.error(`SSR render error for view '${view}': ${err.message}`);
          return next(err);
        }
        res.send(html);
      });
    };
  }

  middleware() {
    return (req, res, next) => {
      res.renderView = (view, data = {}) => {
        const renderData = {
          ...data,
          req,
          user: req.user || null,
          query: req.query,
          params: req.params,
          path: req.path,
          url: req.url,
        };

        res.render(view, renderData);
      };

      next();
    };
  }
}

const createSSRManager = (config) => {
  return new SSRManager(config);
};

module.exports = {
  SSRManager,
  createSSRManager,
};
