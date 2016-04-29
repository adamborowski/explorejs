import LogItemTpl from "../partials/uniqueLogItem.html"
export default () => {
    return {
        restrict: 'E',
        template: LogItemTpl,
        scope: {
            entry: '=',
            openOnStart: '=',
            type: '='
        },
        controller: 'UniqueLogEntryController as controller'
    }
}