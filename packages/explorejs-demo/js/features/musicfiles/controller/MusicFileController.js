export default class MusicFileController {
    constructor($scope, PlaybackService, MusicFileService) {
        this.$scope = $scope;
        this.playbackService = PlaybackService;
        this.musicFileService = MusicFileService;
    }

    play() {
        this.playbackService.playDefault(this.$scope.file, this.onFileFinish.bind(this));
    }

    onFileFinish() {

    }

    onKnowItClick(event) {
        event.stopPropagation();
        this.musicFileService.toggleKnowIt(this.$scope.file);
        this.playbackService.onFilterChange();
    }
}
