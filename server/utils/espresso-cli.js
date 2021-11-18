/*
 * EspressoJS - Hippie's Favy Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * Get Artsy! - CLI
 */

const fs = require('fs');
const { exec } = require("child_process");
const { string, number } = require('yargs');
const yargs = require('yargs');
const cfgBuffer = fs.readFileSync('./config.json');
const cfgBuJSON = cfgBuffer.toString();
const cfgB = JSON.parse(cfgBuJSON);

yargs.command({
    command: 'show',
    describe: 'Show pre-compiled Instance',
    handler: function () {
        console.log(cfgB)
    }
})
yargs.command({
    command: 'run',
    describe: 'Run pre-compiled Instance',
    handler: function () {
        if (cfgB !== undefined) {
            const cmd_ct = `
                  ( (
                   ) )
                ........
                | .VMD |]
                |      /    
                 '----'/_zik...
            `;
            console.warn(`${cmd_ct}`)
            console.warn(`Espresso CLI\n--------------\nWarming Up Configs..\nRunning ....\n\nInstance Config:\nConfiguration: ${cfgB.instance}\nEndpoint: localhost:${cfgB.port}\nJSON:`, cfgB, `\n\nTo stop process press CTRL+C`)
            exec(`node ./node_modules/cross-env/src/bin/cross-env NODE_ENV=${cfgB.instance} PORT=${cfgB.port} node espresso.js`, (error, stdout, stderr) => {
                if (error) { console.log(`error: ${error.message}`); return; }
                if (stderr) { console.log(`stderr: ${stderr}`); return; }
                console.log(`stdout: ${stdout}`);
            });
        }

    }
})
yargs.command({
    command: 'env',
    describe: 'Environment Configurations',
    builder: {
        instance: {
            describe: 'Instance to run global, dev, prod --instance=dev',
            demandOption: false,
            type: string
        },
        port: {
            describe: 'Instance Port --port=8080',
            demandOption: true,
            type: number
        }
    },
    handler: function (argv) {
        if (argv.instance === undefined) {
            cfgB.instance = cfgB.instance;
        } else if (argv.instance !== cfgB.instance) {
            cfgB.instance = argv.instance;
        }
        if (cfgB.port !== argv.port) {
            cfgB.port = argv.port;
            console.warn("New config saved...");
        } else {
            cfgB.port = cfgB.port;
            console.warn("Config already saved...")
        }
        const instUpdate = JSON.stringify(cfgB);
        fs.writeFileSync('config.json', instUpdate);
    }
})
yargs.parse()