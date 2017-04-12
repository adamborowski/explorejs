import tpl from "../partials/musicFile.html"
export default () => {
    return {
        restrict: 'E',
        template: tpl,
        scope: {
            file: '=',
            current: '='
        },
        controller: 'MusicFileController as controller'
    }
}