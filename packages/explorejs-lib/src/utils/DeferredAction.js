export default class DeferredAction {

    /**
     * TODO make deferred action to call action for first invocation, then accumulate arguments for the rest, like in Throttle.js
     * @param callback {Function}
     */
    constructor(callback, delay) {
        this._callback = callback;
        this._delay = delay;
        this._arguments = [];
        this._currentTimeout = null;
        this._timeoutCallback = this._timeoutCallback.bind(this);
    }

    invoke(args) {
        this._arguments.push(args);
        if (!this.isPending()) {
            this._currentTimeout = setTimeout(this._timeoutCallback, this._delay);
        }
    }

    _timeoutCallback() {
        var accumulatedArguments = this._arguments;

        this._arguments = [];
        delete this._currentTimeout;
        this._callback(accumulatedArguments);
    }

    /**
     * Cancels timeout and removes all accumulated arguments
     * @return {boolean} if cancelled any call
     */
    cancel() {
        if (!this.isPending()) {
            return false;
        }
        clearTimeout(this._currentTimeout);
        delete this._currentTimeout;
        this._arguments = [];
        return true;
    }

    isPending() {
        return this._currentTimeout != null;
    }

    setDelay(delay) {
        this._delay = delay;
    }
}
