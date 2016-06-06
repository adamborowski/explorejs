var FactoryDictionary = require('./FactoryDictionary');
var Range = require('./Range');
/**
 * TODO replace non-sorted listeners list with sth like segment tree or interval tree
 * TODO - like two ordered arrays - one for each bound: startBounds:ordered, endBounds:ordered
 * TODO - so they can intersect in a free way
 * @property {FactoryDictionary} listeners
 */
class RangeScopedEvent {
    constructor() {
        this.listeners = new FactoryDictionary(()=>[]);
    }

    addListener(type, range, callback) {
        this.listeners.get(type).push({range, callback});
    }

    /**
     *
     * @param {string} type
     * @param {function} callback
     * @param {Range} newRange
     */
    changeListener(type, callback, newRange) {

        var listeners = this.listeners.get(type);
        for (var listener of listeners) {
            /**
             * @var {Range} listener.range
             */
            if (listener.callback == callback) {
                listener.range.start = newRange.start;
                listener.range.end = newRange.end;
                listeners.splice(listeners.indexOf(listener), 1);
                return listener;
            }
        }
    }

    removeListener(type, callback) {
        var listeners = this.listeners.get(type);
        for (var listener of listeners) {
            if (listener.callback == callback) {
                listeners.splice(listeners.indexOf(listener), 1);
                return listener;
            }
        }
    }

    /**
     * call listeners with ranges overlapping by this range
     * @param name {string}
     * @param range {Range}
     * @param eventData {*}
     */
    fireEvent(name, range, eventData) {
        var listeners = this.listeners.get(name);
        for (var listener of listeners) {
            if (listener.range.hasCommon(range)) {
                listener.callback(eventData);
            }
        }
    }
}

module.exports = RangeScopedEvent;