/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - INIT
 */
module.exports = (app) => {
  const fs = require("fs");
  const cfg = require("./../");
  const cfgBuffer = fs.readFileSync("./config.json");
  const cfgBuJSON = cfgBuffer.toString();
  const cfgB = JSON.parse(cfgBuJSON);

  const cmd_header = "We are brewing your Espresso";
  const cmd_nl = "\n";
  const cmd_ct = `
        ( (
          ) )
      ........
      | .VMD |]
      |      /    
       '----'/_zik...
  `;
  const cmd_ready = "Your Espresso is ready!";
  const cmd_port = `Instance Config\nLive Preview: http://localhost:${
    cfgB.port || process.env.PORT || cfg.port
  }`;
  console.warn(
    `${
      cmd_header +
      cmd_nl +
      cmd_ct +
      cmd_nl +
      cmd_ready +
      cmd_nl +
      cmd_port +
      cmd_nl
    } \n\nTo stop process press CTRL+C`
  );
};
