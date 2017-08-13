/**
 * A helper which listens to wheel event of given dom element and calculates new range parameters
 */
export default class MouseWheelHelper {
    /**
     * Creates and initialized mouse wheel helper
     * @param dom {HTMLElement} dom element which triggers wheel event
     * @param callback {function} the callback which will be triggered with new range parameters after zoom event occur
     * @param getDisplayedRange {function} supplier which returns current displayed range
     * @param zoomFactor {number} the factor of zoom speed
     * @param panFactor {number} the factor of pan speed
     * @param getScreenRange {function} supplier for actual screen position of displayed range
     * it should return object with start and width keys
     */
    constructor(dom, callback, getDisplayedRange, getScreenRange, zoomFactor = 0.45, panFactor = 0.1) {
        this.dom = dom;
        this.callback = callback;
        this.getDisplayedRange = getDisplayedRange;
        this.getScreenRange = getScreenRange;
        this.zoomFactor = zoomFactor;
        this.panFactor = panFactor;
        this.init();
    }

    init() {
        this.dom.addEventListener('wheel', this.onWheel);
        window.addEventListener('keydown', this.onKeyPress);
    }

    onKeyPress = (e) => {
        e.preventDefault();

        const [left, up, right, down] = [37, 38, 39, 40];

        switch (e.keyCode) {
            case left:
                this.pan(-1/4);
                break;
            case right:
                this.pan(1/4);
                break;
            case up:
                this.zoom(1/3);
                break;
            case down:
                this.zoom(3);
                break;
        }
    };

    onWheel = (e) => {

        if (e.shiftKey) {
            const step = e.deltaY / Math.abs(e.deltaY) * this.panFactor;

            this.pan(step);
        } else {

            const {left, width} = this.getScreenRange();
            const centerOffset = ((e.clientX - left) / width);
            const step = e.deltaY < 0 ? this.zoomFactor : 1 / this.zoomFactor;

            this.zoom(step, centerOffset);
        }

        e.stopPropagation();
        e.preventDefault();
    };

    zoom(step, centerOffset = 0.5) {
        const range = this.getDisplayedRange();
        const start = range.start;
        const end = range.end;
        const length = end - start;
        const offsetPoint = centerOffset * length + start;

        const leftDistance = offsetPoint - start;
        const rightDistance = end - offsetPoint;

        this.callback(offsetPoint - leftDistance * step, offsetPoint + rightDistance * step);
    }

    pan(step) {
        const window = this.getDisplayedRange();
        const start = window.start;
        const end = window.end;
        const length = end - start;
        const padding = length * step;

        this.callback(start + padding, end + padding);
    }

    destroy() {
        this.dom.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('keydown', this.onKeyPress);
    }
}
