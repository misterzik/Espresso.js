/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso 
 * Express Plug & Play Server
 * -----------------
 * @param {*} app - EspressoJS by Vimedev.com Labs
 */

const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const cfg = require("./server");
const configBuffer = fs.readFileSync("./config.json"),
  configJSON = configBuffer.toString(),
  configData = JSON.parse(configJSON);

const Path = require("path"),
  Cors = require("cors"),
  Compression = require("compression"),
  Favicon = require("serve-favicon"),
  Static = require("serve-static"),
  Port = configData.port || process.env.PORT || cfg.port,
  Routes = require("./routes/index");

const mongoose = require("mongoose");
const setCustomCacheControl = (res, path) => {
  if (Static.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
};

if (cfg.mongo_isEnabled == true) {
  let hasPort, hasUri;
  if (cfg.mongo.port == "") {
    hasPort = "/";
  } else {
    hasPort = ":" + cfg.mongo.port + "/";
  }
  if (cfg.mongo.uri == "") {
    hasUri = process.env.MONGO_URI;
  } else {
    hasUri = cfg.mongo.uri;
  }
  const url = `mongodb+srv://${hasUri + hasPort + cfg.mongo.db}`;
  mongoose.Promise = global.Promise;
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      promiseLibrary: require("bluebird"),
    })
    .then(() => console.log(":: DB Connection succesful ::"))
    .catch((err) => console.error(err));
}

app.use(Compression());
app.use(Cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(Favicon(Path.join("./public", "favicon.ico")));
app.use(
  Static(Path.join("./public"), {
    maxAge: "1d",
    setHeaders: setCustomCacheControl,
    etag: true,
    extensions: "error.html",
  })
);

Routes(app);
app.listen(Port);
module.exports = app;
