import tpl from "../partials/player.html"
export default () => {
    return {
        restrict: 'E',
        template: tpl,
        scope: {
            file: '='
        },
        controller: 'PlayerController as controller'
    }
}