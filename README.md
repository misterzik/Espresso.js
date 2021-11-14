
![Espresso](Espresso-Logo.png)

## EspressoJS / Espresso
  

### EspressoJS / Espresso It's your one-stop Express Configuration Boiler-Plate, plug-and-play configuration to get you started with hosting your front-end projects. Barebones configuration with the option to scale up using MongoDB.

#### Express Server boiler-plate with some beans for fiber. This ain't Goya!.  (mongoDB Ready)

### Getting Started


* Download [latest release](https://github.com/misterzik/Espresso.js/tags) or in your bash of choice; $ git clone Espresso.js

  

   `git clone https://github.com/misterzik/Espresso.js.git`

  

* Change directory to new cloned repository by using your command line of choice. (NodeJS is Require to be installed.)

  `cd "YOUR-PATH"/Espresso.js`

* Once in Espresso.js folder, Install project dependencies by typing;

  `npm install`

  

* After installing all dependencies from Espresso, You are ready to run it, before hand I left you three files that can/should be modified to your liking; 

  Pre-made Configurations:
  * `server/config/config.global.js`
  * `server/config/config.production.js`
  * `server/config/config.development.js`

  Let's run the demo from the files included, we can start by bundling the demo JavaScript located `/public/assets/js/` by typing on your terminal `npm run webpack-dev`this will bundle the JavaScript needed for the `index.html`.

* Run project Without MongoDB, by running `npm start`, If you would like to run instance with MongoDB run `npm run dev` or `npm run prod` .
 
   Note: If you use MongoDB you have to edit the following file with your MongoDB instance credentials;
   `server/config/config.production.js` or `server/config/config.development.js`


* Stop server by pressing `CTRL + C` to terminated the Espresso process.

  

### Requirements 

 * NodeJS
 * NPM

Make sure you already have NodeJS/NPM installed. MongoDB installed on your system in the case you desired to use the Express MongoDB Integration provided.s