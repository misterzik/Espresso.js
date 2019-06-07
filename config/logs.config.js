/*
 * Vimedev.com Labs
 */

module.exports = (app) => {
    const cmd_header = 'We are brewing your Espresso';
    const cmd_nl = '\n';
    const cmd_ct = `
      ( (
        ) )
    ........
    |  VMD |]
    |      /    
     '----'
    `;
    const cmd_ready = 'Coffee is ready';
    const _port = require('./port.config');
    const cmd_port = `Live Preview: http://localhost: ${_port.number}`
    console.warn(`${cmd_header + cmd_nl + cmd_ct + cmd_nl + cmd_ready + cmd_nl + cmd_port + cmd_nl + "DB Status:"}`);
};