/**
 *  AppConfig is the configuration of the whole application, in case
 *  you have different stuff for each env
 *
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import ConfiguratorBase from 'lib/ConfiguratorBase';
import __config from 'etc/config';

class Configurator extends ConfiguratorBase {
    constructor(features, app) {
        super(features, app);
        this.config = __config;
    }

    execute() {
        this.constant('CONF', this.config);
    }
}

export default Configurator;
