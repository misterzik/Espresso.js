/* _V2-MisterZik
 * Express Packages Declaration
 */
const express = require('express');
const path = require('path');
const app = express();
/*
 * Express GZIP Compression
 * For a high-traffic website in production, the best way to put compression
 * in place is to implement it at a reverse proxy level (see Use a reverse proxy).
 *
 * In that case, you do not need to use compression middleware.
 * For details on enabling gzip compression in Nginx,
 * see Module ngx_http_gzip_module in the Nginx documentation.
 *
 */
const compression = require('compression');
app.use(compression());
/*
 * Express Body-Parser
 * Parse the body of requests which have payloads attached to them.
 */
 const bodyParser = require('body-parser');
 //To parse URL encoded data
 app.use(bodyParser.urlencoded({ extended: false }))

 //To parse json data
 app.use(bodyParser.json())

/*
 * Express Port's Configuration
 */
const port = process.env.PORT || 8080;
/*
 * Express Read Static Folders
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(__dirname + 'public/assets'));
app.use('/assets/js', express.static(__dirname + 'public/assets/js'));
app.use('/assets/css', express.static(__dirname + 'public/assets/css'));
app.use('/assets/images', express.static(__dirname + 'public/assets/images'));
/*
 * Express Dynamic Routing
 */
app.all('/*', function (req, res, next) {
  // Make index.html serve other files to support HTML5Mode
  res.sendFile('index.html', { root: __dirname + '/public'});
})
/*
 * Express Terminal Responce
 */
app.listen(port);
/*
 * Terminal Output
 */
console.log(`Brewing .... Espresso ...!\n` + `On the Stretch ...!\n` + `Served your Coffee at your localhost!, with port:` + port + `\nLive Preview: http://localhost:` + port);
