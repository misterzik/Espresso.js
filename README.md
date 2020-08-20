
![Espresso](Espresso-Logo.png)

## EspressoJS


---



### Express Server Bare-Bones with some Beans for fiber. This ain't Goya!. (mongoDB Ready)




### Getting Started


* Download [latest release](https://github.com/misterzik/Espresso.js/tags) or git clone Espresso.js

    `git clone https://github.com/misterzik/Espresso.js.git`

* Open cmd/terminal inside folder

    `cd "YOUR-PATH"/Espresso.js`

* Install dependencies

    `npm install`

* To run the pre-made demo found on `/public/`, Go ahead and run 

    Without MongoDB:

    `npm start`

    With MongoDB:
    
    `npm run esp` 
    
* In the case of getting curious and you make changes to the demo files located on `/public/assets/js/jQuery` make sure to build the project to see updates by running the following commands :

    for development environment

    `npm run bu-dev` 

    for production environment

    `npm run bu-prod` 

* Stop server by pressing: 
    
    `CTRL + C`

##### Requirements : Please make sure you already have Node/NPM installed, and MongoDB installed on your system. (If you dont wan't mongodb, run npm start, which will use `server/config/config.global.js`)