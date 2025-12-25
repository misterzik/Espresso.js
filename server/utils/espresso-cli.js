/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - CLI
 */

const { exec, spawn } = require("child_process");
const { string, number, boolean } = require("yargs");
const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const { readConfigFile, writeConfigFile, vmdLogo, getDefaultConfig } = require("./config.utils");

const cfgB = readConfigFile();

function showCommand() {
  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║              ESPRESSO.JS CONFIGURATION                ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(JSON.stringify(cfgB, null, 2));
  console.log("\n");
}

function runCommand() {
  if (cfgB !== undefined) {
    const cmd_ct = vmdLogo;
    console.log(`${cmd_ct}`);
    console.log(
      `Espresso CLI
--------------
Warming Up Configs..
Running ....

Instance Config:
Configuration: ${cfgB.instance}
Endpoint: http://localhost:${cfgB.port}
JSON:`,
      JSON.stringify(cfgB, null, 2),
      `\n\nTo stop process press CTRL+C\n`
    );
    
    const child = spawn(
      "node",
      ["index.js"],
      { 
        stdio: "inherit", 
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: cfgB.instance,
          PORT: cfgB.port.toString()
        }
      }
    );

    child.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });

    child.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Process exited with code ${code}`);
      }
      process.exit(code);
    });
  }
}

function envCommand(argv) {
  try {
    if (argv.instance !== undefined) {
      cfgB.instance = argv.instance;
      console.log(`✓ Instance set to: ${argv.instance}`);
    }
    if (argv.port !== undefined && cfgB.port !== argv.port) {
      cfgB.port = argv.port;
      console.log(`✓ Port set to: ${argv.port}`);
    }
    writeConfigFile(cfgB);
    console.log("✓ Configuration saved successfully");
  } catch (error) {
    console.error(`✗ Error saving configuration: ${error.message}`);
    process.exit(1);
  }
}

function initCommand(argv) {
  const configPath = path.join(process.cwd(), "config.json");
  
  if (fs.existsSync(configPath) && !argv.force) {
    console.error("✗ config.json already exists. Use --force to overwrite.");
    process.exit(1);
  }

  const defaultConfig = getDefaultConfig();
  writeConfigFile(defaultConfig);
  console.log("✓ config.json created successfully");
  console.log("\nDefault configuration:");
  console.log(JSON.stringify(defaultConfig, null, 2));
}

function validateCommand() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    
    if (!fs.existsSync(configPath)) {
      console.error("✗ config.json not found");
      process.exit(1);
    }

    readConfigFile();
    console.log("✓ Configuration is valid");
  } catch (error) {
    console.error(`✗ Configuration validation failed: ${error.message}`);
    process.exit(1);
  }
}

function versionCommand() {
  const packagePath = path.join(__dirname, "../../package.json");
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  console.log(`\nEspressoJS v${pkg.version}`);
  console.log(`Node ${process.version}`);
  console.log(`Platform: ${process.platform}\n`);
}

yargs
  .scriptName("espresso")
  .usage("$0 <command> [options]")
  .command({
    command: "show",
    describe: "Show current configuration",
    handler: showCommand,
  })
  .command({
    command: "run",
    describe: "Run the Express server with current configuration",
    handler: runCommand,
  })
  .command({
    command: "env",
    describe: "Update environment configuration",
    builder: {
      instance: {
        describe: "Instance to run: development, production, or global",
        demandOption: false,
        type: string,
        choices: ["development", "production", "global"],
      },
      port: {
        describe: "Port number for the server",
        demandOption: false,
        type: number,
      },
    },
    handler: envCommand,
  })
  .command({
    command: "init",
    describe: "Initialize a new config.json file",
    builder: {
      force: {
        describe: "Overwrite existing config.json",
        type: boolean,
        default: false,
      },
    },
    handler: initCommand,
  })
  .command({
    command: "validate",
    describe: "Validate the current configuration",
    handler: validateCommand,
  })
  .command({
    command: "version",
    describe: "Show version information",
    handler: versionCommand,
  })
  .demandCommand(1, "You need to specify a command")
  .help()
  .alias("h", "help")
  .alias("v", "version")
  .parse();
