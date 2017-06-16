const Supplier = require('./supplier');

/**
 * A consumer of items which calls callback when batch is full
 * @param batchSize {number} size of batch
 * @param callback {function(Object[])} function to be called with batched items
 * @returns {{supply: (function(Object)), finalize: (function())}}
 */
module.exports = function *(batchSize, callback, levelId) {

    const supplier = Supplier(callback);
    let items = [];

    const reset = () => {
        items.length && supplier.supply(items);
        items = [];
    };

    try {
        while (true) {
            items.push(yield);
            if (items.length === batchSize) {
                reset();
            }
        }
    } finally {
        reset();
        supplier.finalize();
    }
};
