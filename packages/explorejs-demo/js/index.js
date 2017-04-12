/**
 *  index.js launch the application.
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
require.ensure(['splash-screen/splash.min.css', 'splash-screen'], function(require) {

    require('splash-screen/splash.min.css').use();
    require('splash-screen').enable('circular');
});

require.ensure(['less/main.less', 'splash-screen', './main'], function(require) {

    require('less/main.less');

    var App = require('./main').default;
    (new App()).run();
});
