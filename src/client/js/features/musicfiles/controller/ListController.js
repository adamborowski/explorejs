export default class ListController {
    constructor($scope, MusicFileService, PlaybackService) {
        this.logTypes = [];
        $scope.playbackService = PlaybackService;
        MusicFileService.getFiles().then(data=> {
            this.files = data;
        });


        $scope.$watch(()=> {
            return $scope.currentFilter;
        }, (val) => {
            // handle it here. e.g.:
            PlaybackService.CurrentFilter = val;
        });
        $scope.$watch(()=> {
            return PlaybackService.CurrentFilter;
        }, (val) => {
            // handle it here. e.g.:
            $scope.currentFilter = val;
        });

    }


}
