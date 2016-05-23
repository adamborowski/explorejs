'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: './unit-tests/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build/unit-tests'),
        filename: 'test.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: [
                        'es2015'
                    ]
                }
            },
            {
                test: /\.html$/,
                loader: 'raw'
            }
        ]
    },
    resolve: {
        root: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'js/'),
            path.resolve(__dirname, 'js/fw/'),
            path.resolve(__dirname, 'test')
        ]
    }
};
