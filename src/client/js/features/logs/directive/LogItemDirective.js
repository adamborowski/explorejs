import LogItemTpl from "../partials/logItem.html"
export default () => {
    return {
        restrict: 'E',
        template: LogItemTpl,
        scope: {
            log: '=log',
            showIgnored: '=showIgnored'
        },
        controller: 'LogItemController as controller'
    }
}