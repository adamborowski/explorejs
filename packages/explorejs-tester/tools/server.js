// This file configures the development web server
// which supports hot reloading and synchronized testing.

// Require Browsersync along with webpack and middleware for it
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfigBuilder = require('../webpack.config');
var webpackConfig = webpackConfigBuilder('development');

var bundler = webpack(webpackConfig);

// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
  server: {
    baseDir: 'src',

    middleware: [
      webpackDevMiddleware(bundler, {
        // Dev middleware can't access config, so we provide publicPath
        publicPath: webpackConfig.output.publicPath,

        // pretty colored output
        stats: { colors: true },

        // Set to false to display a list of each file that is being bundled.
        noInfo: true

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ]
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/*.html'
  ]
});
