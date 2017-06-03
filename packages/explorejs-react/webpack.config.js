/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'explorejs-react';

let plugins = [], outputFile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({minimize: true}));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

const config = {
    entry: __dirname + '/src/index.js',
    devtool: 'eval-source-map',
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
        'explorejs-lib': 'explorejs-lib',
        moment: 'moment',
        underscore: 'underscore',
        'dygraphs': 'dygraphs',
        'jquery': 'jquery',
        'prop-types': 'prop-types',
        'explorejs-adapters': 'explorejs-adapters',
    },
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /(\.jsx|\.js)$/,
                use: 'eslint-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
        modules: [path.resolve('./src'), path.resolve('./node_modules')],
        extensions: ['.json', '.js']
    },
    plugins: plugins
};

module.exports = config;
