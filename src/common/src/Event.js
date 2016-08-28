var FactoryDictionary = require('./FactoryDictionary');
/**
 * @property {FactoryDictionary} listeners
 */
class Event {
    constructor() {
        this.listeners = new FactoryDictionary(()=>[]);
    }

    addListener(type, callback) {
        this.listeners.get(type).push(callback);
    }

    removeListener(type, callback) {
        var listeners = this.listeners.get(type);
        for (var listener of listeners) {
            if (listener == callback) {
                listeners.splice(listeners.indexOf(listener), 1);
                return listener;
            }
        }
    }

    /**
     * call listeners
     * @param name {string}
     * @param eventData {*}
     */
    fireEvent(name, eventData) {
        var listeners = this.listeners.get(name);
        for (var listener of listeners) {
            listener(eventData);
        }
    }
}

module.exports = Event;