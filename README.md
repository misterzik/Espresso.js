![Espresso](https://raw.githubusercontent.com/misterzik/Espresso.js/main/espresso.png)

## EspressoJS / Espresso

### EspressoJS / Espresso is your one-stop Express Configuration starting point or boilerplate. Simple, and unopinionated, EspressoJS plug-and-play configurations are based on Express. Espresso will get you started with an Express instance in seconds.

## Getting Started

- Download [latest release](https://github.com/misterzik/Espresso.js/packages/364567)

  `npm install --save @misterzik/espressojs`

- Create `config.json` to handle the instances

  ```
  {
    "instance":"global",
    "port":8080
  }
  ```

- Create `.env` if you don't want to use config. A mix is possible.

  ```
  MONGO_URI=USER:PASSWORD@DOMAIN.mongodb.net
  MONGO_URI_PORT=27017
  MONGO_URI_DB=clients
  API_URI_ON=FALSE
  API_URI=
  PORT=8080
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

- NodeJS
- NPM
