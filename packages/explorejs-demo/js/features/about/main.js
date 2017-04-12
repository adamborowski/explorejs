/**
 * ******************************************************************************************************
 *
 *   Defines a about feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 * ******************************************************************************************************
 */
'use strict';
import FeatureBase from 'lib/FeatureBase';
import Routes from './Routes';
import AboutController from './controller/AboutController';
import AboutService from './service/AboutService';

class Feature extends FeatureBase {

    constructor() {
        super('about');
        this.routes = Routes;
    }

    execute() {
        this.controller('AboutController', AboutController);
        this.service('AboutService', AboutService);
    }
}

export default Feature;
