/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Plugin Manager
 * Manages optional dependencies and plugins
 */

const logger = require("../utils/logger");

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.loadedModules = new Map();
  }

  /**
   * Check if a module is available
   * @param {string} moduleName - Name of the module to check
   * @returns {boolean} - True if module is available
   */
  isAvailable(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName) !== null;
    }

    try {
      const module = require(moduleName);
      this.loadedModules.set(moduleName, module);
      return true;
    } catch (error) {
      this.loadedModules.set(moduleName, null);
      return false;
    }
  }

  /**
   * Safely require a module
   * @param {string} moduleName - Name of the module to require
   * @param {boolean} throwOnError - Whether to throw error if module not found
   * @returns {any|null} - Module or null if not available
   */
  safeRequire(moduleName, throwOnError = false) {
    if (this.loadedModules.has(moduleName)) {
      const module = this.loadedModules.get(moduleName);
      if (module === null && throwOnError) {
        throw new Error(`Required module '${moduleName}' is not installed`);
      }
      return module;
    }

    try {
      const module = require(moduleName);
      this.loadedModules.set(moduleName, module);
      return module;
    } catch (error) {
      this.loadedModules.set(moduleName, null);
      
      if (throwOnError) {
        throw new Error(
          `Required module '${moduleName}' is not installed. ` +
          `Install it with: npm install ${moduleName}`
        );
      }
      
      logger.debug(`Optional module '${moduleName}' is not available`);
      return null;
    }
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {Object} plugin - Plugin object with initialize method
   */
  register(name, plugin) {
    if (this.plugins.has(name)) {
      logger.warn(`Plugin '${name}' is already registered, overwriting...`);
    }
    
    this.plugins.set(name, plugin);
    logger.info(`Plugin '${name}' registered successfully`);
  }

  /**
   * Initialize a plugin
   * @param {string} name - Plugin name
   * @param {Object} app - Express app instance
   * @param {Object} config - Plugin configuration
   */
  async initialize(name, app, config = {}) {
    const plugin = this.plugins.get(name);
    
    if (!plugin) {
      throw new Error(`Plugin '${name}' is not registered`);
    }

    if (typeof plugin.initialize !== 'function') {
      throw new Error(`Plugin '${name}' does not have an initialize method`);
    }

    try {
      await plugin.initialize(app, config);
      logger.info(`Plugin '${name}' initialized successfully`);
    } catch (error) {
      logger.error(`Failed to initialize plugin '${name}': ${error.message}`);
      throw error;
    }
  }

  /**
   * Initialize all registered plugins
   * @param {Object} app - Express app instance
   * @param {Object} configs - Map of plugin configurations
   */
  async initializeAll(app, configs = {}) {
    const results = [];
    
    for (const [name, plugin] of this.plugins) {
      try {
        await this.initialize(name, app, configs[name] || {});
        results.push({ name, success: true });
      } catch (error) {
        results.push({ name, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get a plugin by name
   * @param {string} name - Plugin name
   * @returns {Object|null} - Plugin object or null
   */
  get(name) {
    return this.plugins.get(name) || null;
  }

  /**
   * Check if a plugin is registered
   * @param {string} name - Plugin name
   * @returns {boolean} - True if plugin is registered
   */
  has(name) {
    return this.plugins.has(name);
  }

  /**
   * Get all registered plugin names
   * @returns {Array<string>} - Array of plugin names
   */
  list() {
    return Array.from(this.plugins.keys());
  }

  /**
   * Unregister a plugin
   * @param {string} name - Plugin name
   */
  unregister(name) {
    if (this.plugins.delete(name)) {
      logger.info(`Plugin '${name}' unregistered`);
      return true;
    }
    return false;
  }

  /**
   * Clear all plugins
   */
  clear() {
    this.plugins.clear();
    this.loadedModules.clear();
    logger.info("All plugins cleared");
  }
}

// Singleton instance
const pluginManager = new PluginManager();

module.exports = pluginManager;
module.exports.PluginManager = PluginManager;
