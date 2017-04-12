/**
 *  Defines the HomeService
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
var HomeService = function($http, utils) {

    this.getStates = function() {
            return $http.get(utils.getApi('/states'));
    };

    this.getMenus = function() {
        return $http.get(utils.getApi('/menus'));
    };

    this.getDropdown = function() {
        return $http.get(utils.getApi('/dropdown'));
    };

};

HomeService.$inject = ['$http', 'utils'];

export default HomeService;
