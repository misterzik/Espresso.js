/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Security Middleware
 */

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const helmetConfig = (options = {}) => {
  const strictCSP = options.strictCSP || process.env.NODE_ENV === "production";
  
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: strictCSP ? ["'self'"] : ["'self'", "'unsafe-inline'"],
        scriptSrc: strictCSP ? ["'self'"] : ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    status: "error",
    message: "Too many API requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const hppProtection = hpp({
  whitelist: [],
});

const sanitizeData = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious data in ${key}`);
  },
});

const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
  });
};

module.exports = {
  helmetConfig,
  rateLimiter,
  strictRateLimiter,
  apiRateLimiter,
  hppProtection,
  sanitizeData,
  createRateLimiter,
};
