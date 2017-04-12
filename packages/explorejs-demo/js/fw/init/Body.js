/**
 *  BodyInit set ng-view to the index.html.
 *
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import InitBase from 'lib/InitBase';
import { element } from 'angular';

class Initializer extends InitBase {

    constructor(features) {
        super(features);
    }

    execute() {
        element(document.body).append('<div ng-view autoscroll="true" class="main"></div>');
    }
}

export default Initializer;
