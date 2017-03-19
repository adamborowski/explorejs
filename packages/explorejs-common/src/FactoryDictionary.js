'use strict';
/**
 * @template TValue
 */
class FactoryDictionary {
    /**
     *
     * @param factory {fuction(string)} factory function with key as argument
     */
    constructor(factory) {
        this.factory = factory;
        this.clear();
    }

    clear() {
        this.dict = {};
        this.keys = [];
    }

    /**
     * @param key
     * @return {TValue}
     */
    get(key) {
        if (!this.dict.hasOwnProperty(key)) {
            this.dict[key] = this.factory(key);
            this.keys.push(key);
        }
        return this.dict[key];
    }

    remove(key) {
        delete this.dict[key];
    }

    has(key) {
        return this.dict.hasOwnProperty(key);
    }

    forEach(func) {
        for (var i = 0; i < this.keys.length; i++) {
            func(this.keys[i], this.dict[this.keys[i]]);
        }
    }

    map(func) {
        var a = [];
        for (var i = 0; i < this.keys.length; i++) {
            a.push(func(this.keys[i], this.dict[this.keys[i]]));
        }
        return a;
    }

    getValues() {
        var a = [];
        for (var i = 0; i < this.keys.length; i++) {
            if (this.dict.hasOwnProperty(this.keys[i])) {
                a.push(this.dict[this.keys[i]]);
            }
            else {
                // this element was removed in the past but we don't want to splice keys array as getValues is used rarely
            }
        }
        return a;
    }
}
module.exports = FactoryDictionary;
