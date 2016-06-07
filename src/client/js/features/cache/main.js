/**
 * ******************************************************************************************************
 *
 *   Defines a logs feature
 *
 *  @author  aborowski
 *
 * ******************************************************************************************************
 */
'use strict';
import FeatureBase from 'lib/FeatureBase';
import Routes from './Routes';
import CacheDemoController from './controller/CacheDemoController';
import './style/cache.less';
import './style/chart.less';
class Feature extends FeatureBase {

    constructor(jquery) {
        super('cache');
        this.routes = Routes;
        this.jquery = jquery;
    }

    execute() {
        this.controller('CacheDemoController', CacheDemoController);

    }
}

export default Feature;
