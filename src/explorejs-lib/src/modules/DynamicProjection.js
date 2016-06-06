import Range from "explorejs-common/src/Range";
/**
 * Class to dynamically choose right ProjectionEvent, depending on current viewport settings (start, end, scale)
 * @property {SerieCache} SerieCache
 * @property {number} ScreenPadding - the ratio of with to be appended on both viewport sides
 * @property {number} WantedUnitWidth - how wide (in pixels) should be current level unit best displayed
 */
export default class DynamicProjection {
    constructor() {
        this.ScreenPadding = 0.5; // 0.5 of actual viewport width will be appeneded to left and right viewport window
        this.WantedUnitWidth = 10;
        this.currentId = null;
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
    }

    onProjectionRecompile(diff) {

    }

    setup() {

    }

    /**
     * pick right levelId rebind
     * @param start
     * @param end
     * @param scale
     */
    updateViewStateWithScale(start, end, scale) {
        var newLevelId = this._fitLevelId(scale);

        var padStart = start - scale * this.ScreenPadding;
        var padEnd = end + scale * this.ScreenPadding;
        var paddedRange = Range.leftClosed(padStart, padEnd);

        if (newLevelId != this.currentId) {
            if (this.currentEvent != null) {
                this.currentEvent.removeListener('recompile', this.onProjectionRecompile)
            }
            this.currentId = newLevelId;
            this.currentEvent = this.SerieCache.getProjectionEventAtLevel(this.currentId);
            this.currentEvent.addListener('recompile', paddedRange);
        }
        else {
            this.SerieCache.getProjectionEventAtLevel(this.currentId).changeListener('recompile', this.onProjectionRecompile, paddedRange);
        }
    }

    /**
     * Calculate the most fitting level based on avaliable levels, current viewport state and expected step unit width
     * The target is to have most grain segments not wider than this value.
     * @example if we set WantedUnitWidth = 100, we choose appropriate level unit to have 100 px width
     * start=0, end=100000, width = 500, scale = 200 (200 milliseconds/px)
     * raw (step=1000) will  display own data every 5 px (1000 ms /(200 ms/px))
     * 10s (step=10000) will display own data every 50px  (10000 ms / (200 ms/px))
     * 30s (step=30000) will display own data every 150px (30000 ms / (200 ms/px))
     * The question is: which level we should choose? The answer is: This one with displayed unit width the closest not greater than {@code WantedUnitWidth}.
     * So if in this case we have WantedUnitWidth = 100px, we choose 10s as 50px is the closest not greater than 100px
     * @param {number} scale milliseconds per one pixel on the viewport
     * @private
     */
    _fitLevelId(scale) {
        var levels = this.SerieCache.getSerieManifest().levels;
        var expectedUnitWidth = this.WantedUnitWidth;
        // go from the bigger level (eg. 1y) and find first with unit displayed width not greater than WantedUnitWidth
        for (var i = levels.length - 1; i >= 0; i--) {
            var level = levels[i];
            var unitWidth = level.step / scale;
            // console.log(`${level.id} will take ${unitWidth} ~ should be closely under ${expectedUnitWidth}`);
            if (unitWidth <= expectedUnitWidth) {
                return level.id;
            }
        }
        return 'raw';
    }
}