/**
 *  SSOConfig set authorised configuration.
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import ConfiguratorBase from 'lib/ConfiguratorBase';

class Configurator extends ConfiguratorBase {
    constructor(features, app) {
        super(features, app);
    }

    httpConfig($httpProvider) {
        $httpProvider.defaults.headers.common.Accept = 'application/json;charset=utf-8';
        $httpProvider.defaults.withCredentials = true;
    }

    execute() {
        this.httpConfig.$inject = ['$httpProvider'];
        this.config(this.httpConfig);
    }
}

export default Configurator;
