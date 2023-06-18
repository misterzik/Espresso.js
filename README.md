![Espresso](https://raw.githubusercontent.com/misterzik/Espresso.js/main/espresso.png)

## EspressoJS / Espresso

### Introducing Espresso.JS, your ultimate Express configuration starting point and boilerplate. With its simplicity and lack of opinionation, EspressoJS offers plug-and-play configurations built on top of Express.

### Whether you're a beginner or an experienced developer, EspressoJS will have you up and running with an Express instance in a matter of seconds. Say goodbye to tedious setup and hello to streamlined development with EspressoJS.

## Getting Started

- Download [latest release](https://github.com/misterzik/Espresso.js/releases)

  `npm install --save @misterzik/espressojs`

- Create `config.json` to handle the instances

  ```
  {
    "instance": "development",
    "port": 8080,
    "hostname": "",
    "mongoDB": {
      "enabled": false,
      "uri": "",
      "instance": "database"
    },
    "api": {
      "enabled": false,
      "uri": "https://swapi.dev/api/people/",
      "url": "",
      "method": "GET",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
  ```

- Create `.env` if you don't want to use config. A mix is possible.

  ```
  MONGO_USER=USER
  MONGO_TOKEN=PASSWORD
  API_TOKEN=APITOKEN
  ```

- Create `espresso.js` and add the following requirements to call the packages.

  ```
  require("@misterzik/espressojs");
  ```

- Create `cli.js` and add the following requirements to call the packages.

  ```
  require('@misterzik/espressojs/cli');
  ```

- And you are all set to start, To run the instance, use:
  ```
  node cli run
  ```

### Structured Files

Pre-made Configurations:

- `server/config/config.global.js`
- `server/config/config.production.js`
- `server/config/config.development.js`

### Commands

- Stop server by pressing `CTRL + C` to terminated the Espresso process.

### Requirements

Installed prior using Espresso.JS

- NodeJS
- NPM
