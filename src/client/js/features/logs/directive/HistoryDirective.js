import HistoryTpl from "../partials/history.html"
export default () => {
    return {
        restrict: 'E',
        template: HistoryTpl,
        scope: {
            entry: '=',
            opened: '='
        },
        controller: 'HistoryController as controller',
        link: (scope, element, attrs)=> {
            element.bind("keydown", function (event) {
                if (event.which === 27) {
                    scope.$apply(()=> scope.controller.close());
                    event.preventDefault();
                }
            });
        }
    }
}