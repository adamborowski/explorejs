var FactoryDictionary = require('./FactoryDictionary');
/**
 * TODO replace non-sorted listeners list with sth like OrderedSegmentArray
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

    removeListener(callback) {
        var listeners = this.listeners.get(name);
        for (var listener of listeners) {
            if (listener.callback == callback) {
                listeners.splice(listeners.indexOf(listener), 1);
            }
        }
    }

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