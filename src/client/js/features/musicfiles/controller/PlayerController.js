export default class PlayerController {
    constructor($scope, PlaybackService, MusicFileService, FilterService) {
        this.$scope = $scope;
        $scope.autoplay = true;
        this.playbackService = PlaybackService;
        this.musicFileService = MusicFileService;
        $scope.playbackService = this.playbackService;

        MusicFileService.getFiles().then((files)=> {
            $scope.$on('musicend', (a)=> {
                if ($scope.autoplay) {
                    this.playbackService.playNextDefault();//(files[files.indexOf(PlaybackService.lastMusicFile) + 1], null);
                }
            })
        });

        $scope.$watch(()=> {
            return $scope.randomStart;
        }, (randomStart) => {
            // handle it here. e.g.:
            this.playbackService.PlayFromStart = !randomStart;
        });
        $scope.$watch(()=> {
            return this.playbackService.PlayFromStart;
        }, (playFromStart) => {
            // handle it here. e.g.:
            $scope.randomStart = !playFromStart;
        });

        $scope.$watch(()=> {
            return $scope.loopList;
        }, (val) => {
            // handle it here. e.g.:
            this.playbackService.LoopList = val;
        });
        $scope.$watch(()=> {
            return this.playbackService.LoopList;
        }, (val) => {
            // handle it here. e.g.:
            $scope.loopList = val;
        });

        $scope.$watch(()=> {
            return $scope.currentFilter;
        }, (val) => {
            // handle it here. e.g.:
            this.playbackService.CurrentFilter = val;
        });
        $scope.$watch(()=> {
            return this.playbackService.CurrentFilter;
        }, (val) => {
            // handle it here. e.g.:
            $scope.currentFilter = val;
        });


        $scope.availableFilters = FilterService.filters.map(a=> {
            return {
                name: a.name,
                text: a.text,
                click: ()=> {
                    PlaybackService.CurrentFilter = a;
                }
            }
        });
        $scope.currentFilter = PlaybackService.CurrentFilter;

    }

    set Duration(val) {
        if (!isNaN(val)) {
            if (val > 1) {
                this.playbackService.defaultDuration = val * 1000;
            }
        }
    }

    get Duration() {
        return this.playbackService.defaultDuration / 1000;
    }

    fullscreen() {
        this.$scope.fullscreen = !this.$scope.fullscreen;
    }

    onKnowItClick(event) {
        event.stopPropagation();
        this.musicFileService.toggleKnowIt(this.playbackService.musicFile);
        this.playbackService.onFilterChange();
    }
}
