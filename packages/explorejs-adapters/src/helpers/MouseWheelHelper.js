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
    }

    onWheel = (e) => {

        if (e.shiftKey) {
            const step = e.deltaY / Math.abs(e.deltaY) * this.panFactor;

            this.pan(step);
        } else {

            const {start, width} = this.getScreenRange();
            const centerOffset = ((e.screenX - start) / width);
            const step = e.deltaY / Math.abs(e.deltaY) * this.zoomFactor + 1;

            this.zoom(step, centerOffset);
        }
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
    }
}
