/**
 *  Defines the HomeController controller
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */


export default class HomeController {
    test() {



    }


    constructor($scope, events, utils, HomeService, $alert) {
        $scope.$alert = $alert;


        $scope.params = {
            radius: {min: 1, max: 100, value: 35, formatter: (o)=>`Promień kuli ${o} cm`},
            angle: {min: 0, max: 90, value: 20, formatter: (o)=>`Nachylenie równi ${o} °`},
            timeScale: {min: 0.1, max: 2, step: 0.1, formatter: (o)=>`Tempo x ${o}`},
            slopeHeight: {min: 5, max: 10000, step: 1, value: 100, formatter: (o)=>`Wysokość równi ${o} cm`},
            frame: {formatter: (o)=>`Klatka #${o}`}
        };


        var noty = function (type, msg) {
            events.emit('alert', {type: type, message: msg});
        };

        $scope.showSuccessNoty = function () {
            noty('success', 'This is success noti!!');
        };

        $scope.showErrorNoty = function () {
            noty('error', 'This is error noty');
        };

        $scope.showInfoNoty = function () {
            noty('info', 'This is info noty');
        };

        $scope.showInfo = function () {
            events.emit('info', {
                content: 'It\'s simple info dialog',
                onClose: function () {
                    noty('info', 'Dialog closed!');
                }
            });
        };

        $scope.showError = function () {
            events.emit('error', {
                content: 'It\'s error dialog',
                onClose: function () {
                    noty('info', 'Error Dialog closed!');
                }
            });
        };

        $scope.showConfirm = function () {
            events.emit('confirm', {
                content: 'It\'s confirm dialog',
                onConfirm: function () {
                    noty('info', 'Confirmed!');
                }
            });
        };

        $scope.showCustom = function () {
            events.emit('modal', {
                scope: $scope,
                title: 'It\'s custom dialog',
                animation: 'am-fade-and-slide-top',
                templateUrl: 'customTpl'
            });
        };

        $scope.closeCustom = function ($hide) {
            $hide();
            noty('info', 'custom modal closed!');
        };

        HomeService.getStates()
            .success(function (data) {
                $scope.states = data;
            });

        HomeService.getMenus()
            .success(function (data) {
                $scope.menus = data;
            });

        $scope.button = {radio: 'right'};

        HomeService.getDropdown()
            .success(function (data) {
                $scope.dropdowns = data;
            });

        $scope.selectTab = function (tab, $event) {
            utils.stopEvent($event);
            if (tab.active) {
                return;
            }
            tab.active = true;
            _.chain($scope.tabs)
                .reject({name: tab.name})
                .each(function (t) {
                    t.active = false;
                });
        };

        $scope.$on('$destroy', function () {
        });


        this.test()
    };
}
