/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * Routes Control
 * ----
 * @param {*} app - Vimedev.com Labs
 */

 module.exports = (app)=> {
    const cfg = require('./../../server'),
    path = require('path'),
    api = require('./api');
    
    app.get('/', function(res) {
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    });
    
    if(cfg.swapi_isEnabled == true){
        app.use('/api', api);
    }

    require('./db')(app); 
    require('./../utils/global.message')(app);

    app.use(function (req, res, next) {
        res.status(404).send("404 - Sorry can't find that!")
    })
}

