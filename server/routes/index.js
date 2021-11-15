/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * Routes Control
 * ----
 * @param {*} app - Vimedev.com Labs
 */

 module.exports = (app)=> {
    const cfg = require('./../../server');
    const path = require('path');
    const api = require('./api');
    
    app.get('/', function(req, res, next) {
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    });
    
    if(cfg.swapi_isEnabled == true){
        app.use('/api', api);
    }

    require('./db')(app); 
    require('../global.message')(app);

    app.use((req, res, next) => {
        let err = new Error('404 - Not Found');
        err.status = 404;
        next(err);
    })
}

