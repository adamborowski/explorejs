const FactoryDictionary = require('./FactoryDictionary');
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
        const listeners = this.listeners.get(type);

        for (const listener of listeners) {
            if (listener === callback) {
                listeners.splice(listeners.indexOf(listener), 1);
                return listener;
            }
        }
        return null;
    }

    /**
     * call listeners
     * @param name {string}
     * @param eventData {*}
     */
    fireEvent(name, eventData) {
        const listeners = this.listeners.get(name);

        for (const listener of listeners) {
            listener(eventData);
        }
    }
}

module.exports = Event;
