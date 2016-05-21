module.exports = class CutOperation {
    static getCutInfo(subject, cutter) {
        if(subject==null){
            return null;
        }
        if(cutter == null){
            return null;
        }
        var start = this._getPointInfo(subject, cutter.start);
        var end = this._getPointInfo(subject, cutter.end);
        if (end == 'above' || end == 'start') {
            return 'above';
        }
        if (start == 'end' || start == 'below') {
            return 'below';
        }
        // we know that cutter intersects the subject somehow
        if ((start == 'start' || start == 'above') && (end == 'end' || end == 'below')) {
            return 'remove'
        }
        if (start == 'inside' && end == 'inside') {
            return 'middle';
        }
        if (end == 'inside') {
            return 'top';
        }
        return 'bottom';
    }

    static _getPointInfo(range, point) {
        if (point < range.start) {
            return 'above';
        }
        if (point == range.start) {
            return 'start';
        }
        if (point < range.end) {
            return 'inside';
        }
        if (point == range.end) {
            return 'end';
        }
        return 'below';
    }
};