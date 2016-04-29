/**
 *  NotifierConfig set angular-sweetnotifier needed configuration
 *
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

    notifierConfig(notifierProvider) {
        notifierProvider.setPlacement('top', 'right');
        notifierProvider.setUseNativeWhileBlur(true);
    }

    execute() {
        this.notifierConfig.$inject = ['notifierProvider'];
        this.config(this.notifierConfig);
    }
}

export default Configurator;
