/*
 * EspressoJS v5.0.0 - Plugin Usage Example
 * 
 * This example demonstrates how to use the new plugin architecture
 * in EspressoJS v5.0.0
 */

const express = require('express');
const app = express();

// Import EspressoJS components
const { plugins, pluginManager, config } = require('@misterzik/espressojs');

// Example 1: Using Built-in Plugins
async function useBuiltInPlugins() {
  console.log('=== Using Built-in Plugins ===\n');

  // Access SSR Plugin
  if (plugins.ssr && plugins.ssr.enabled) {
    console.log('✓ SSR Plugin is enabled');
    
    // Generate static HTML
    try {
      await plugins.ssr.generateStaticFile('index', 'dist/index.html', {
        title: 'Home Page',
        message: 'Welcome to EspressoJS v5.0.0'
      });
      console.log('✓ Static HTML generated');
    } catch (error) {
      console.log('✗ SSR not configured:', error.message);
    }
  }

  // Access API Plugin
  if (plugins.api && plugins.api.enabled) {
    console.log('✓ API Plugin is enabled');
    console.log(`  Documentation: http://localhost:${config.port}/api/docs`);
  }

  // Access MongoDB Plugin
  if (config.mongoDB?.enabled) {
    console.log('✓ MongoDB Plugin is enabled');
  }
}

// Example 2: Creating a Custom Plugin
const customCachePlugin = {
  cache: new Map(),

  async initialize(app, config) {
    if (!config.enabled) {
      console.log('Custom cache plugin is disabled');
      return;
    }

    console.log('Initializing custom cache plugin...');

    // Add cache methods to app.locals
    app.locals.cache = {
      get: (key) => this.cache.get(key),
      set: (key, value, ttl = 3600) => {
        this.cache.set(key, value);
        if (ttl > 0) {
          setTimeout(() => this.cache.delete(key), ttl * 1000);
        }
      },
      delete: (key) => this.cache.delete(key),
      clear: () => this.cache.clear(),
      has: (key) => this.cache.has(key)
    };

    console.log('✓ Custom cache plugin initialized');
  }
};

// Example 3: Registering and Using Custom Plugin
async function useCustomPlugin() {
  console.log('\n=== Using Custom Plugin ===\n');

  // Register the plugin
  pluginManager.register('customCache', customCachePlugin);
  console.log('✓ Custom cache plugin registered');

  // Initialize the plugin
  await pluginManager.initialize('customCache', app, { enabled: true });

  // Use the plugin
  app.get('/api/cached-data', (req, res) => {
    const cacheKey = 'myData';

    // Check cache
    if (app.locals.cache.has(cacheKey)) {
      console.log('Cache hit!');
      return res.json({
        status: 'success',
        data: app.locals.cache.get(cacheKey),
        cached: true
      });
    }

    // Simulate data fetch
    const data = { message: 'Fresh data', timestamp: Date.now() };
    
    // Store in cache (60 seconds TTL)
    app.locals.cache.set(cacheKey, data, 60);

    res.json({
      status: 'success',
      data,
      cached: false
    });
  });

  console.log('✓ Route with caching created: GET /api/cached-data');
}

// Example 4: Checking Module Availability
function checkModuleAvailability() {
  console.log('\n=== Checking Module Availability ===\n');

  const modules = [
    'mongoose',
    'ejs',
    'pug',
    'handlebars',
    'express-rate-limit',
    'swagger-jsdoc',
    'redis' // Not installed by default
  ];

  modules.forEach(module => {
    const available = pluginManager.isAvailable(module);
    console.log(`${available ? '✓' : '✗'} ${module}: ${available ? 'Available' : 'Not installed'}`);
  });
}

// Example 5: Safe Require Pattern
function safeRequireExample() {
  console.log('\n=== Safe Require Pattern ===\n');

  // Try to require optional module (won't throw error)
  const redis = pluginManager.safeRequire('redis');
  if (redis) {
    console.log('✓ Redis is available, can use it');
  } else {
    console.log('✗ Redis not installed, using fallback');
  }

  // Require with error throwing
  try {
    const required = pluginManager.safeRequire('some-required-module', true);
  } catch (error) {
    console.log('✗ Required module not found:', error.message);
  }
}

// Example 6: Using Rate Limiting Plugin
function useRateLimiting() {
  console.log('\n=== Using Rate Limiting ===\n');

  if (plugins.rateLimit) {
    // Get default limiter
    const defaultLimiter = plugins.rateLimit.getLimiter('default');
    
    // Get custom limiter (if configured)
    const apiLimiter = plugins.rateLimit.getLimiter('api');
    
    // Create custom limiter
    const strictLimiter = plugins.rateLimit.createLimiter({
      windowMs: 60000, // 1 minute
      max: 5,
      message: 'Too many requests, please slow down'
    });

    // Apply to routes
    app.use('/api/public', apiLimiter || defaultLimiter);
    app.use('/api/strict', strictLimiter);

    console.log('✓ Rate limiting configured for routes');
  } else {
    console.log('✗ Rate limiting plugin not available');
  }
}

// Example 7: Using API Response Formatters
function useAPIFormatters() {
  console.log('\n=== Using API Response Formatters ===\n');

  // Success response
  app.get('/api/users', (req, res) => {
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ];
    res.success(users, 'Users retrieved successfully');
  });

  // Error response
  app.get('/api/error', (req, res) => {
    res.error('Something went wrong', 500);
  });

  // Paginated response
  app.get('/api/posts', (req, res) => {
    const posts = [/* ... */];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = 100;

    res.paginate(posts, page, limit, total);
  });

  console.log('✓ API routes with formatters created');
}

// Example 8: Static Site Generation
async function generateStaticSite() {
  console.log('\n=== Static Site Generation ===\n');

  if (!plugins.ssr || !plugins.ssr.enabled) {
    console.log('✗ SSR plugin not enabled');
    return;
  }

  const pages = [
    {
      view: 'index',
      output: 'dist/index.html',
      data: { title: 'Home', content: 'Welcome to our site' }
    },
    {
      view: 'about',
      output: 'dist/about.html',
      data: { title: 'About', content: 'About our company' }
    },
    {
      view: 'contact',
      output: 'dist/contact.html',
      data: { title: 'Contact', content: 'Get in touch' }
    }
  ];

  try {
    const results = await plugins.ssr.generateStaticSite(pages);
    const successful = results.filter(r => r.success).length;
    console.log(`✓ Generated ${successful}/${pages.length} static pages`);
  } catch (error) {
    console.log('✗ Static generation failed:', error.message);
  }
}

// Example 9: List All Plugins
function listAllPlugins() {
  console.log('\n=== Registered Plugins ===\n');

  const registeredPlugins = pluginManager.list();
  console.log('Plugins:', registeredPlugins.join(', '));

  // Check each plugin
  Object.entries(plugins).forEach(([name, plugin]) => {
    const status = plugin?.enabled ? 'Enabled' : 'Disabled';
    console.log(`  ${name}: ${status}`);
  });
}

// Main execution
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║         EspressoJS v5.0.0 - Plugin Examples          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    // Run examples
    await useBuiltInPlugins();
    checkModuleAvailability();
    safeRequireExample();
    await useCustomPlugin();
    useRateLimiting();
    useAPIFormatters();
    listAllPlugins();
    // await generateStaticSite(); // Uncomment if views are configured

    console.log('\n✓ All examples completed successfully!\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  customCachePlugin,
  useBuiltInPlugins,
  useCustomPlugin,
  checkModuleAvailability
};
