
![Espresso](Espresso-Logo.png)

## EspressoJS - #Express Boiler-Plate v3.0.1

### Express Server Boiler Plate or Espresso, It's your one-stop shop, plug-and-play configuration to get you started with projects. This is barebones configuration with the option to scale up using mongoDB

### Getting Started

##### Requirements : Please make sure you already have NodeJS, and MongoDB installed on your operational system. The application comes with a pre-made demo, If you would like to mimic it, Please make sure you have clients db on your mongoDB with clients collections.

* Download latest release, has zip/tar file.

* Open terminal and redirect to folder `cd "YOUR-PATH"/Espresso.js` for Powershell `cd "'YOUR-PATH'"\Espresso.js`

* Install dependencies located on Package.JSON by doing `npm install`

* To run the pre-made demo found on `/public/`, Go ahead and run `npm start` this will make the server start on port 8080.

* In the case of getting curious and you make changes to the demo files located on `/public/assets/js/jQuery` make sure to build the project to see updates by running the following command `npm run dev-build` for development environment and `npm run prod-build` for production environment.

* Restart server by clicking the following keys with the terminal open on this session, `CTRL + C`

##### Release Notes :

###### * We went ahead and refactor some of the functionality, and also provided latest updates of packages to the people utilizing this on a every day basis. 
###### * Unfortunately we had to discontinue the usage of the library `chokidar` due to cross-operational system issues, as well has performance issues on our hosting providers. Please allow us some time to look for a more suitable watcher for changes.
