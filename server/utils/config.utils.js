const Static = require("serve-static");
const fs = require("fs");

function readConfigFile() {
  const cfgBuffer = fs.readFileSync("./config.json");
  const cfgBuJSON = cfgBuffer.toString();
  return JSON.parse(cfgBuJSON);
}

function writeConfigFile(cfg) {
  const instUpdate = JSON.stringify(cfg);
  fs.writeFileSync("config.json", instUpdate);
}

const vmdLogo = `
( (
  ) )
........
| .VMD |]
|      /    
'----'/.ZI|<..
      `;

const setCustomCacheControl = (res, path) => {
  if (Static.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
};

module.exports = {
  readConfigFile,
  writeConfigFile,
  vmdLogo,
  setCustomCacheControl,
};
