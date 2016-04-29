/**
 *  Defines the AboutService
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
export default class AboutService {
    constructor($http, utils) {
        this.getDemoList = function () {
            return $http.get(utils.getApi('/demolist'));
        };
    }
};
