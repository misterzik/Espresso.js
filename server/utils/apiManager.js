/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - API Manager Utility
 */

const axios = require("axios");
const logger = require("./logger");

class APIManager {
  constructor(config) {
    this.apis = {};
    this.loadAPIs(config);
  }

  loadAPIs(config) {
    const apiKeys = Object.keys(config).filter(key => key.match(/^api\d*$/));
    
    apiKeys.forEach(key => {
      const apiConfig = config[key];
      
      if (apiConfig && (apiConfig.enabled !== false)) {
        this.apis[key] = {
          name: key,
          baseURL: apiConfig.uri || apiConfig.url || "",
          method: (apiConfig.method || "GET").toUpperCase(),
          headers: apiConfig.headers || { "Content-Type": "application/json" },
          timeout: apiConfig.timeout || 30000,
          retries: apiConfig.retries || 0,
        };
        
        logger.info(`API endpoint '${key}' loaded: ${this.apis[key].baseURL}`);
      }
    });

    logger.info(`Total API endpoints loaded: ${Object.keys(this.apis).length}`);
  }

  getAPI(name = "api") {
    return this.apis[name];
  }

  getAllAPIs() {
    return this.apis;
  }

  hasAPI(name) {
    return !!this.apis[name];
  }

  async request(apiName, endpoint = "", options = {}) {
    const api = this.getAPI(apiName);
    
    if (!api) {
      throw new Error(`API '${apiName}' not found in configuration`);
    }

    const url = endpoint ? `${api.baseURL}${endpoint}` : api.baseURL;
    const config = {
      method: options.method || api.method,
      url,
      headers: { ...api.headers, ...options.headers },
      timeout: options.timeout || api.timeout,
      ...options,
    };

    let lastError;
    const maxRetries = options.retries !== undefined ? options.retries : api.retries;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`API request to ${apiName}: ${config.method} ${url} (attempt ${attempt + 1}/${maxRetries + 1})`);
        const response = await axios(config);
        
        logger.info(`API ${apiName} request successful: ${response.status}`);
        return response.data;
      } catch (error) {
        lastError = error;
        logger.warn(`API ${apiName} request failed (attempt ${attempt + 1}/${maxRetries + 1}): ${error.message}`);
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error(`API ${apiName} request failed after ${maxRetries + 1} attempts`);
    throw lastError;
  }

  createAxiosInstance(apiName) {
    const api = this.getAPI(apiName);
    
    if (!api) {
      throw new Error(`API '${apiName}' not found in configuration`);
    }

    return axios.create({
      baseURL: api.baseURL,
      timeout: api.timeout,
      headers: api.headers,
    });
  }
}

module.exports = APIManager;
