/*
 * EspressoJS - SSR Plugin
 * Server-Side Rendering with Static Site Generation
 */

const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class SSRPlugin {
  constructor() {
    this.enabled = false;
    this.engine = "ejs";
    this.viewsDir = "views";
    this.cache = false;
    this.staticGeneration = false;
    this.app = null;
  }

  initialize(app, config = {}) {
    if (!config.enabled) {
      logger.info("SSR plugin is disabled");
      return;
    }

    this.enabled = true;
    this.app = app;
    this.engine = config.engine || "ejs";
    this.viewsDir = config.viewsDir || "views";
    this.cache = config.cache !== undefined ? config.cache : process.env.NODE_ENV === "production";
    this.layout = config.layout || null;
    this.helpers = config.helpers || {};
    this.staticGeneration = config.staticGeneration || false;

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

    // Add SSR middleware
    app.use(this.middleware());

    logger.info(`SSR initialized with ${this.engine} engine`);
    logger.info(`Views directory: ${viewsPath}`);
    logger.info(`View caching: ${this.cache ? "enabled" : "disabled"}`);

    if (this.staticGeneration) {
      logger.info("Static site generation enabled");
    }
  }

  setupEngine(app) {
    switch (this.engine) {
      case "ejs":
        const ejs = pluginManager.safeRequire("ejs");
        if (!ejs) {
          throw new Error("EJS not installed. Install with: npm install ejs");
        }
        app.set("view options", {
          rmWhitespace: true,
          cache: this.cache,
        });
        break;

      case "handlebars":
      case "hbs":
        const handlebars = pluginManager.safeRequire("handlebars");
        if (!handlebars) {
          throw new Error("Handlebars not installed. Install with: npm install handlebars");
        }

        // Note: express-handlebars is optional, using basic handlebars
        app.engine("hbs", (filePath, options, callback) => {
          fs.readFile(filePath, (err, content) => {
            if (err) return callback(err);
            const template = handlebars.compile(content.toString());
            const rendered = template(options);
            return callback(null, rendered);
          });
        });
        app.set("view engine", "hbs");
        break;

      case "pug":
        const pug = pluginManager.safeRequire("pug");
        if (!pug) {
          throw new Error("Pug not installed. Install with: npm install pug");
        }
        app.locals.basedir = path.join(process.cwd(), this.viewsDir);
        break;

      default:
        logger.warn(`Unknown template engine: ${this.engine}, defaulting to EJS`);
        this.engine = "ejs";
        this.setupEngine(app);
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

  /**
   * Generate static HTML from a view
   * @param {string} view - View name
   * @param {Object} data - Data to pass to view
   * @returns {Promise<string>} - Rendered HTML
   */
  async generateStatic(view, data = {}) {
    if (!this.app) {
      throw new Error("SSR plugin not initialized");
    }

    return new Promise((resolve, reject) => {
      this.app.render(view, data, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });
  }

  /**
   * Generate and save static HTML file
   * @param {string} view - View name
   * @param {string} outputPath - Output file path
   * @param {Object} data - Data to pass to view
   */
  async generateStaticFile(view, outputPath, data = {}) {
    const html = await this.generateStatic(view, data);
    const fullPath = path.join(process.cwd(), outputPath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, html, "utf8");
    logger.info(`Static file generated: ${outputPath}`);
    return fullPath;
  }

  /**
   * Generate multiple static pages
   * @param {Array} pages - Array of {view, output, data} objects
   */
  async generateStaticSite(pages = []) {
    if (!this.staticGeneration) {
      logger.warn("Static generation is not enabled");
      return [];
    }

    const results = [];

    for (const page of pages) {
      try {
        const filePath = await this.generateStaticFile(
          page.view,
          page.output,
          page.data || {}
        );
        results.push({ success: true, file: filePath });
      } catch (error) {
        logger.error(`Failed to generate ${page.output}: ${error.message}`);
        results.push({ success: false, file: page.output, error: error.message });
      }
    }

    logger.info(`Static site generation complete: ${results.filter(r => r.success).length}/${results.length} pages`);
    return results;
  }
}

module.exports = new SSRPlugin();
