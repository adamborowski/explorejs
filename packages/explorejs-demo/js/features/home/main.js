/**
 * ******************************************************************************************************
 *
 *   Defines a home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 * ******************************************************************************************************
 */
'use strict';
import FeatureBase from 'lib/FeatureBase';
import Routes from './Routes';
import HomeController from './controller/HomeController';
import UserPlayController from './controller/UserPlayController';
import HomeService from './service/HomeService';
import customTpl from './partials/custom.html';
import Simulation from './directive/Simulation'
import Tooltip from "./directive/Tooltip"
import Slider from "./directive/Slider"




class Feature extends FeatureBase {

    constructor(jquery) {
        super('home');
        this.routes = Routes;
        this.jquery = jquery;
    }

    execute() {
        this.controller('HomeController', HomeController);
        this.controller('UserPlayController', UserPlayController);
        this.service('HomeService', HomeService);
        this.directive("simulation", Simulation);
        this.directive("tooltip", Tooltip);
        this.directive("slider", Slider);
        this.run([
            '$templateCache',
            function($templateCache) {
                $templateCache.put('customTpl', customTpl);
            }
        ]);

    }
}

export default Feature;
