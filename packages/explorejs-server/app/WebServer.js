var express = require('express');
var Api = require('./Api');
var path = require('path');
var proxy = require('proxy-middleware');
var url = require('url');
var bodyParser = require('body-parser')
var compression = require('compression')
module.exports = class WebServer {
    constructor(config) {
        this.config = config;
    }

    start() {
        var app = express();

        var api = new Api(app, {files: this.config.files, sourcePath: this.config.sourcePath});
        app.use(bodyParser.json());
        app.use(compression());
        api.load();

        if (this.config.devServer) {
            app.use('/', proxy(url.parse('http://localhost:' + this.config.devServerPort)));
        }
        else {
            var staticPath = path.resolve(__dirname, '../../explorejs-demo/build/');
            console.log('\n static path: ' + staticPath);
            app.use(express.static(staticPath));
            app.all('*', function (req, res) {
                res.sendfile(staticPath + "/" + 'index.html');
            });
        }
        app.listen(this.config.port, ()=> {
            process.stderr.write(`\nView application in the web browser: http://localhost:${this.config.port}\n`);
        });
    }


};