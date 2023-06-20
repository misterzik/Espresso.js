/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - CLI
 */

const { exec } = require("child_process");
const { string, number } = require("yargs");
const yargs = require("yargs");
const { readConfigFile, writeConfigFile, vmdLogo } = require("./config.utils");

const cfgB = readConfigFile();
function showCommand() {
  console.log(cfgB);
}
function runCommand() {
  if (cfgB !== undefined) {
    const cmd_ct = vmdLogo;
    console.warn(`${cmd_ct}`);
    console.warn(
      `Espresso CLI
--------------
Warming Up Configs..
Running ....

Instance Config:
Configuration: ${cfgB.instance}
Endpoint: http://localhost:${cfgB.port}
JSON:`,
      cfgB,
      `\n\nTo stop process press CTRL+C`
    );
    exec(
      `node ./node_modules/cross-env/src/bin/cross-env NODE_ENV=${cfgB.instance} PORT=${cfgB.port} node index.js`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  }
}
function envCommand(argv) {
  if (argv.instance !== undefined) {
    cfgB.instance = argv.instance;
  }
  if (cfgB.port !== argv.port) {
    cfgB.port = argv.port;
    console.warn("New config saved...");
  } else {
    console.warn("Config already saved...");
  }
  writeConfigFile(cfgB);
}

yargs.command({
  command: "show",
  describe: "Show pre-compiled Instance",
  handler: showCommand,
});
yargs.command({
  command: "run",
  describe: "Run pre-compiled Instance",
  handler: runCommand,
});
yargs.command({
  command: "env",
  describe: "Environment Configurations",
  builder: {
    instance: {
      describe: "Instance to run global, dev, prod --instance=dev",
      demandOption: false,
      type: string,
    },
    port: {
      describe: "Instance Port --port=8080",
      demandOption: true,
      type: number,
    },
  },
  handler: envCommand,
});
yargs.parse();
