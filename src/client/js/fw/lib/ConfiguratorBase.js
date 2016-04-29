/**
 *  ConfiguratorBase class
 *
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
class ConfiguratorBase {

    constructor(features, app) {
        this.features = features;
        this.app = app;

        this.config = app.config;
        this.constant = app.constant;
        this.value = app.value;
    }

    execute() {
    }
}

export default ConfiguratorBase;
