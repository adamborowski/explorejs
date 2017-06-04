#!/usr/local/bin/node --max-old-space-size=200000
"use strict";
var process = require('process');
var argv = require('./argv');
var path = require('path');
var WebServer = require('./app/WebServer');


var sourcePath = path.isAbsolute(argv.path) ? argv.path : path.resolve(process.cwd(), argv.path);

var files = [];
var webserver = new WebServer({
    port: argv.port,
    files,
    sourcePath: sourcePath,
    devServer: argv['webpack-dev-server'],
    devServerPort: argv['webpack-dev-port'],
    clientAppPath: argv['client-app-path'],
});
webserver.start();

