/**
 *  Mock utils service
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';

var utils = function($q) {

    this.getApi = function(api) {
        return api;
    };

    this.promise = function(func) {
        var promise = $q(func);
        promise.success = function(fn) {
            promise.then(function(response) {
                fn(response);
            });
            return promise;
        };
        promise.error = function(fn) {
            promise.then(null, function(response) {
                fn(response);
            });
            return promise;
        };
        return promise;
    };
};

export default ['$q', utils];
