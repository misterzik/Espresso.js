const Static = require("serve-static");
const fs = require("fs");
const path = require("path");
const { validateConfig } = require("./configValidator");
const logger = require("./logger");

function readConfigFile() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    
    if (!fs.existsSync(configPath)) {
      logger.warn("config.json not found, using default configuration");
      return getDefaultConfig();
    }

    const cfgBuffer = fs.readFileSync(configPath);
    const cfgBuJSON = cfgBuffer.toString();
    const config = JSON.parse(cfgBuJSON);
    
    return validateConfig(config);
  } catch (error) {
    logger.error(`Error reading config file: ${error.message}`);
    return getDefaultConfig();
  }
}

function writeConfigFile(cfg) {
  try {
    const validatedConfig = validateConfig(cfg);
    const instUpdate = JSON.stringify(validatedConfig, null, 2);
    fs.writeFileSync("config.json", instUpdate);
    logger.info("Configuration file updated successfully");
  } catch (error) {
    logger.error(`Error writing config file: ${error.message}`);
    throw error;
  }
}

function getDefaultConfig() {
  return {
    instance: "development",
    port: 8080,
    hostname: "",
    publicDirectory: "/public",
    mongoDB: {
      enabled: false,
      port: null,
      uri: "",
      instance: "database",
    },
    api: {
      enabled: false,
      uri: "",
      url: "",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
      retries: 0,
    },
  };
}

const vmdLogo = `
( (
  ) )
........
| .VMD |]
|      /    
'----'/.ZI|<..
      `;

const setCustomCacheControl = (res, path) => {
  if (Static.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
};

module.exports = {
  readConfigFile,
  writeConfigFile,
  getDefaultConfig,
  vmdLogo,
  setCustomCacheControl,
};
