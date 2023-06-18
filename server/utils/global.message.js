/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Init
 */
module.exports = (app) => {
  const { readConfigFile, vmdLogo } = require("config.utils");
  const cfgB = readConfigFile();
  const cmd_header = "We are brewing your Espresso";
  const cmd_ct = vmdLogo;
  const cmd_ready = "Your Espresso is ready!";
  const cmd_port = `Instance Config\nLive Preview: http://localhost:${
    cfgB.port || process.env.PORT || cfg.port
  }`;
  console.warn(`${cmd_header}\n${cmd_ct}\n${cmd_ready}\n${cmd_port}\n\nTo stop the process, press CTRL+C`);
};
