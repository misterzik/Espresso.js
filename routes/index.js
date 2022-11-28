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

module.exports = (app) => {
  const configuration = require("../server"),
    Path = require("path"),
    api = require("./api");
  app.get("/", function (res) {
    res.sendFile("index.html", { root: Path.join("./public") });
  });
  if (configuration.swapi_isEnabled == true) {
    app.use("/api", api);
  }
  require("./db")(app);
  app.use(function (req, res, next) {
    res.status(404).send("404 - Sorry can't find that!");
  });
};
