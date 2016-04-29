/**
 *  Defines the AboutController controller
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
export default class AboutController {
    constructor($scope, AboutService, events) {

        $scope.showSpinner = true;

        AboutService.getDemoList()
            .success(function (data) {
                $scope.showSpinner = false;
                $scope.originDemolist = data;
                $scope.demolist = [].concat($scope.originDemolist);
            }).error(function (err) {
            events.emit('error', {content: err});
        });

        $scope.$on('$destroy', function () {
        });
    }

};
