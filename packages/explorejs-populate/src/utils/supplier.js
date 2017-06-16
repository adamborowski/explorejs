/**
 * Turns simple callback, fulfull/reject object, generator into coherent supply()/finalize() api
 * @param callback
 */
module.exports = (callback) => {
    if (typeof callback === 'function') {
        return {
            supply(val) {
                callback(val);
            },
            finalize() {
                // we do not call simple callback to finalize job, use either supply/finalize object or generator
            }
        };
    }
    if (callback.fulfill && callback.reject) {
        return {
            supply(val) {
                callback.fulfill(val);
            },
            finalize() {
                callback.reject();
            }
        };
    }
    if (callback.resolve && callback.reject) {
        return {
            supply(val) {
                callback.resolve(val);
            },
            finalize() {
                callback.reject();
            }
        };
    }
    if (callback.next && callback.return) {
        callback.next();
        return {
            supply(val) {
                callback.next(val);
            },
            finalize() {
                callback.return();
            }
        };
    }
    throw new Error('Unsupported type of callback');
};
