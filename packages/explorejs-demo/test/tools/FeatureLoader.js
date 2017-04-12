/**
 *  Feature loader
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';

var loader = function(Feature) {
    var feature = new Feature();
    feature.run();
    return feature;
};

export default loader;
