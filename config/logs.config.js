/*
 * Terminal Output
 * Insanen.com Labs
 */

module.exports = (app) => {
const cmd_header = 'Brewing your Espresso ... ☕️';
const cmd_nl = '\n';
const cmd_ct = 'On the strech ...';
const cmd_ready = 'Coffee is ready ...  ☕️ ';
const _port = require('./port.config');
    
console.warn(`${ cmd_header + cmd_nl + cmd_ct + cmd_nl + cmd_ready +
  cmd_nl + "🍺  🍺  🍺  Live Preview: http://localhost:" + _port +
  cmd_nl + "MongoDB Status:" 
}`);

};