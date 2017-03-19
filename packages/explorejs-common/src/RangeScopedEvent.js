const FactoryDictionary = require('./FactoryDictionary');

/**
 * TODO replace non-sorted listeners list with sth like segment tree or interval tree
 * TODO - like two ordered arrays - one for each bound: startBounds:ordered, endBounds:ordered
 * TODO - so they can intersect in a free way
 * @property {FactoryDictionary} listeners
 */
class RangeScopedEvent {
    constructor() {
        this.listeners = new FactoryDictionary(() => []);
    }

    /**
     * Adds a listener to event type on specified range
     * @param type {String} event type
     * @param range {Range}
     * @param callback {function}
     */
    addListener(type, range, callback) {
        this.listeners.get(type).push({range, callback});
    }

    /**
     * Updates listener's range
     * @param {string} type
     * @param {function} callback
     * @param {Range} newRange
     */
    changeListener(type, callback, newRange) {

        const listeners = this.listeners.get(type);

        for (let listener of listeners) {
            /**
             * @var {Range} listener.range
             */
            if (listener.callback === callback) {
                listener.range = newRange;
                return listener;
            }
        }
        return null;
    }

    removeListener(type, callback) {
        const listeners = this.listeners.get(type);

        for (let listener of listeners) {
            if (listener.callback === callback) {
                listeners.splice(listeners.indexOf(listener), 1);
                return listener;
            }
        }
        return null;
    }

    /**
     * Fire event occured on same range - only callbacks which can hear will be called
     * call listeners with ranges overlapping by given range
     * @param name {string}
     * @param range {Range}
     * @param eventData {*}
     */
    fireEvent(name, range, eventData) {
        const listeners = this.listeners.get(name);

        for (let listener of listeners) {
            if (listener.range.hasCommon(range)) {
                listener.callback(name, range, listener.range, eventData);
            }
        }
    }
}

module.exports = RangeScopedEvent;
