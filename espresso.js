/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----------------
 * Express Plug & Play Server
 * -----------------
 * @param {*} app - EspressoJS by Vimedev.com Labs
 */

/*
 * EspressoJS - Global Vars Declaration
 */
const express = require('express');
const app = express();

const _path = require('path');
const _cors = require('cors');
const _compr = require('compression');
const _bodyParser = require('body-parser');
const _favicon = require('serve-favicon');

const _static = require('serve-static');

const _portReq = require('./server/config/port.config');
const _port = process.env.PORT || _portReq.number;

/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ----
 * MongoDB Integration
 * ----
 * By default this is not Enabled, 
 * Please uncomment text below in order 
 * to enable MongoDB Integration.
 * ----
 * Note: You should have mongoDB already
 * running locally in order for this section to
 * work. 
 */ 

/*
const mongoose = require('mongoose');
const _dbConfig = require('./config/database.config');

mongoose.Promise = global.Promise;
mongoose.connect(_dbConfig.url, {
        useNewUrlParser: true,
        promiseLibrary: require('bluebird')
    })
    .then(() => console.log('EspressoJS- DB Connection succesful - Extra Sugar!!!'))
    .catch((err) => console.error(err));
*/

app.use(_compr());
app.use(_cors());
app.use(_bodyParser.urlencoded({ extended: false }))
app.use(_bodyParser.json())
app.use(_favicon(_path.join(__dirname, 'public', 'favicon.ico')))
app.use(_static(_path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: setCustomCacheControl,
    etag: true,
    extensions: 'error.html'
}))

function setCustomCacheControl(res, path) {
    if (_static.mime.lookup(path) === 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=0')
    }
}

/*
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ---
 * Express Dynamic Routing
 */

const index = require('./server/routes/index');
const api = require('./server/routes/db/api');


app.use('/', index);
app.use('/api', api);
require('./server/routes/db/client.js')(app); 
require('./server/config/logs.config.js')(app);
app.listen(_port);

app.use((req, res, next) => {
    let err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
})

module.exports = app;