/**
 *  Defines the Autofocus Module.
 *  This module used to override the original `autofocus` attribute since it doesn't work properly with ngRoute
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
import FeatureBase from 'lib/FeatureBase';

class Feature extends FeatureBase {

    constructor() {
        super('AutofocusModule');
    }

    autoFocus() {
        return {
            restrict: 'A',
            link: function($scope, element) {
                element[0].focus();
            }
        };
    }

    execute() {
        this.directive('autofocus', this.autoFocus);
    }
}

export default Feature;
