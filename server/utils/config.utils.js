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

module.exports = { readConfigFile, writeConfigFile, vmdLogo };
