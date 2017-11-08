var AppRunner = require('./rss/app-runner');
var fs = require('fs');

var configFile = process.env.CFG_FILE || './config.json';
var app = new AppRunner();

fs.readFile(configFile, 'utf8', onConfigLoaded);

fs.watch(configFile, 'utf8', (eventType, filename) => {
    console.log('realoding configuration file');
    console.log(configFile);
    fs.readFile(configFile, 'utf8', onConfigLoaded);
});

function onConfigLoaded(err, data) {
    if (err) {
        console.error(err);
    }
    try {
        var config = JSON.parse(data);
        console.log('Config file loaded.');
        app.start(config);
    } catch (exc) {
        console.error(exc);
    }
}