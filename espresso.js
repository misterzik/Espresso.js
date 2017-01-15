/*
 * Express Configuration - Mz
 */
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

/*
 * Express Run Server - Mz
 */
app = express();
app.use(express.static('public'));
var port = process.env.PORT || 8080;

/*
 * Routing - Mz
 */

app.get('*', function (req, res) {
  res.sendFile(__dirname +'/public/index.html')
})

app.listen(port);
console.log('Espresso Serving coffee at your localhost on port:' + port);
