/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * Client Model
 * ----
 * @param {*} app - Vimedev.com Labs
 */

 module.exports = (app)=> {
    const path = require('path');
    const api = require('./db/api');
    
    app.get('/', function(req, res, next) {
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    });
    
    app.use('/api', api);
    require('./db/client')(app); 
    require('../global.message')(app);

    app.use((req, res, next) => {
        let err = new Error('404 - Not Found');
        err.status = 404;
        next(err);
    })
}

