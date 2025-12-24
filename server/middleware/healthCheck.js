/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Health Check Middleware
 */

const mongoose = require("mongoose");
const os = require("os");

const healthCheck = (req, res) => {
  const healthData = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      usage: process.memoryUsage(),
    },
    cpu: {
      cores: os.cpus().length,
      loadAverage: os.loadavg(),
    },
  };

  if (mongoose.connection.readyState === 1) {
    healthData.database = {
      status: "connected",
      name: mongoose.connection.name,
    };
  } else if (mongoose.connection.readyState === 0) {
    healthData.database = {
      status: "disconnected",
    };
  }

  res.status(200).json(healthData);
};

const readinessCheck = (req, res) => {
  const isReady = mongoose.connection.readyState === 1 || mongoose.connection.readyState === 0;

  if (isReady) {
    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
    });
  }
};

const livenessCheck = (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  healthCheck,
  readinessCheck,
  livenessCheck,
};
