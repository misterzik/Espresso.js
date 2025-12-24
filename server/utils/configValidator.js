/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Configuration Validator
 */

const Joi = require("joi");
const logger = require("./logger");

const apiSchema = Joi.object({
  enabled: Joi.boolean().default(true),
  uri: Joi.string().uri().allow("").default(""),
  url: Joi.string().allow("").default(""),
  method: Joi.string()
    .valid("GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS")
    .default("GET"),
  headers: Joi.object().default({ "Content-Type": "application/json" }),
  timeout: Joi.number().integer().min(0).default(30000),
  retries: Joi.number().integer().min(0).max(5).default(0),
});

const configSchema = Joi.object({
  instance: Joi.string()
    .valid("development", "production", "global")
    .default("development"),
  port: Joi.number().port().default(8080),
  hostname: Joi.string().hostname().allow("").default(""),
  publicDirectory: Joi.string().default("/public"),
  mongoDB: Joi.object({
    enabled: Joi.boolean().default(false),
    port: Joi.number().port().allow(null).default(null),
    uri: Joi.string().allow("").default(""),
    instance: Joi.string().default("database"),
  }).default(),
  api: apiSchema.default(),
}).unknown(true);

const validateConfig = (config) => {
  const { error, value } = configSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    logger.error(`Configuration validation failed: ${errorMessages.join(", ")}`);
    throw new Error(`Invalid configuration: ${errorMessages.join(", ")}`);
  }

  const validatedConfig = { ...value };
  const apiKeys = Object.keys(config).filter(key => key.match(/^api\d*$/));
  
  apiKeys.forEach(key => {
    const { error: apiError, value: apiValue } = apiSchema.validate(config[key], {
      abortEarly: false,
    });
    
    if (apiError) {
      const errorMessages = apiError.details.map((detail) => detail.message);
      logger.warn(`API configuration '${key}' validation warning: ${errorMessages.join(", ")}`);
    }
    
    validatedConfig[key] = apiValue || config[key];
  });

  logger.info(`Configuration validated successfully with ${apiKeys.length} API endpoint(s)`);
  return validatedConfig;
};

const validateEnvVariables = () => {
  const requiredEnvVars = [];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.warn(
      `Missing optional environment variables: ${missingVars.join(", ")}`
    );
  }

  return true;
};

module.exports = {
  validateConfig,
  validateEnvVariables,
  configSchema,
};
