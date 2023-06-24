/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Routes Control
 * ----
 * @param {*} app - Vimedev.com Labs
 */

const path = require("path");
const configuration = require("../server");
const rootDir = process.cwd();
const api = require(path.join(rootDir, "routes", "api.js"));
const db = require(path.join(rootDir, "routes", "db.js"));

module.exports = (app) => {
  app.get("/", function (req, res) {
    const filePath = path.join(rootDir, "public", "index.html");
    res.sendFile(filePath);
  });
  if (configuration.api_isEnabled === true) {
    app.use("/api", api);
  }
  if (configuration.mongo_isEnabled === true) {
    app.use("/api", db);
  }
  app.get("/*", function (req, res) {
    const filePath = path.join(rootDir, "public", "index.html");
    res.sendFile(filePath);
  });
  app.use(function (req, res, next) {
    res.status(404).send("404 - Sorry can't find that!");
  });
};
