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
require("dotenv").config();
const express = require("express");
const app = express();
const cfg = require("./server");
const { readConfigFile } = require("./server/utils/config.utils");
const configData = readConfigFile();

const Path = require("path");
const Cors = require("cors");
const Compression = require("compression");
const Favicon = require("serve-favicon");
const Static = require("serve-static");
const mongoose = require("mongoose");
const Routes = require("./routes/index");

const Port = configData.port || cfg.port;
const mongoConfig = configData.mongo;
const rootDir = process.cwd();

if (configData.mongo_isEnabled) {
  const {
    uri: mongoUri = configData.mongo.uri || "",
    port: mongoPort = configData.mongo.port || "",
    db: mongoDb = configData.mongo.db || "",
  } = mongoConfig;
  const hasPort = mongoPort ? `:${mongoPort}/` : "/";
  const url = `mongodb+srv://${
    process.env.MONGO_USER +
    ":" +
    process.env.MONGO_TOKEN +
    "@" +
    mongoUri 
    +
    hasPort +
    mongoDb
  }`;

  mongoose.Promise = global.Promise;
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      promiseLibrary: require("bluebird"),
    })
    .then(() => console.log(":: DB Connection successful ::"))
    .catch((err) => console.error(err));
}

const setCustomCacheControl = (res, path) => {
  if (Static.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
};

app.use(Compression());
app.use(Cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(Favicon(Path.join(rootDir, "public", "favicon.ico")));
app.use(
  Static(Path.join(rootDir, "public"), {
    maxAge: "1d",
    setHeaders: setCustomCacheControl,
    etag: true,
    extensions: "error.html",
  })
);

Routes(app);
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

module.exports = app;
