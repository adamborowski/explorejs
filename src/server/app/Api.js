var AbstractApi = require('../modules/AbstractApi');
var fs = require('fs');
var path = require('path');
module.exports = class Api extends AbstractApi {
    constructor(app, config) {
        super(app);
        this.config = config;
    }

    load() {
        this.putResource('tiles', this.getTiles);
    }

    getTiles(req) {
        return [];
        // todo parse batch request options, provide a response
    }

};