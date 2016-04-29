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
import LogController from './controller/LogController';
import LogItemController from './controller/LogItemController';
import UniqueLogEntryController from './controller/UniqueLogEntryController';
import HistoryController from './controller/HistoryController';
import LogItemDirective from './directive/LogItemDirective';
import UniqueLogEntryDirective from './directive/UniqueLogEntryDirective';
import HistoryDirective from './directive/HistoryDirective';
import LogClusterService from './service/LogClusterService';
import "./style/LogItem.less"
class Feature extends FeatureBase {

    constructor(jquery) {
        super('logs');
        this.routes = Routes;
        this.jquery = jquery;
    }

    execute() {
        this.controller('LogController', LogController);
        this.controller('LogItemController', LogItemController);
        this.controller('UniqueLogEntryController', UniqueLogEntryController);
        this.controller('HistoryController', HistoryController);
        this.directive('logItem', LogItemDirective);
        this.directive('uniqueLogEntry', UniqueLogEntryDirective);
        this.directive('history', HistoryDirective);
        this.service('LogClusterService', LogClusterService);
        this.directive('schrollBottom', function () {
            return {
                scope: {
                    schrollBottom: "="
                },
                link: function (scope, element) {
                    scope.$watchCollection('schrollBottom', function (newValue) {
                        element[0].scrollTop = newValue;
                    });
                }
            }
        })
        //this.run([
        //    '$templateCache',
        //    function($templateCache) {
        //        $templateCache.put('customTpl', customTpl);
        //    }
        //]);

    }
}

export default Feature;
