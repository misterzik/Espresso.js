/*
 * EspressoJS - MongoDB Plugin
 * Optional MongoDB integration
 */

const logger = require("../utils/logger");
const pluginManager = require("../core/PluginManager");

class MongoDBPlugin {
  constructor() {
    this.mongoose = null;
    this.connection = null;
  }

  async initialize(app, config = {}) {
    if (!config.enabled) {
      logger.info("MongoDB plugin is disabled");
      return;
    }

    // Check if mongoose is available
    this.mongoose = pluginManager.safeRequire("mongoose", true);

    const {
      uri = config.uri || "",
      port = config.port || "",
      db = config.instance || "database",
    } = config;

    if (!process.env.MONGO_USER || !process.env.MONGO_TOKEN) {
      throw new Error(
        "MongoDB credentials not found. Please set MONGO_USER and MONGO_TOKEN in .env file"
      );
    }

    const hasPort = port ? `:${port}/` : "/";
    const credentials = `${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_TOKEN)}`;
    const url = `mongodb+srv://${credentials}@${uri}${hasPort}${db}`;

    this.mongoose.Promise = global.Promise;

    try {
      this.connection = await this.mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      logger.info("MongoDB connection successful");
      logger.info(`Database: ${db}`);

      // Store connection on app for access
      app.locals.mongodb = {
        connection: this.connection,
        mongoose: this.mongoose,
      };

      // Handle connection events
      this.mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
      });

      this.mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
      });

      this.mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected");
      });

    } catch (err) {
      logger.error(`MongoDB connection failed: ${err.message}`);
      if (process.env.NODE_ENV === "production") {
        throw err;
      }
    }
  }

  async close() {
    if (this.connection) {
      await this.mongoose.connection.close(false);
      logger.info("MongoDB connection closed");
    }
  }
}

module.exports = new MongoDBPlugin();
