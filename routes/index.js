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

const Path = require("path");
const configuration = require("../server");
const api = require("./api");
const db = require("./db");

module.exports = (app) => {
  app.get("/", function (res) {
    res.sendFile("index.html", { root: Path.join("./public") });
  });
  if (configuration.api_isEnabled === true) {
    app.use("/api", api);
  }
  if (configuration.mongo_isEnabled === true) {
    db(app);
  }
  app.use(function (req, res, next) {
    res.status(404).send("404 - Sorry can't find that!");
  });
};
