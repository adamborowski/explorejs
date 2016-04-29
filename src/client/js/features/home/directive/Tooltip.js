export default () => {
    return {
        restrict: 'A',
        scope: {
            tooltip: "@tooltip"
        },
        link: function (scope, elements, attr) {
            scope.$watch('tooltip', (val)=> {
                $(elements[0]).attr({
                    'title': val // todo use bootstrap tooltip
                });
            });
        }
    }
};