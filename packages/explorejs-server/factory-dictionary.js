"use strict";
module.exports = class FactoryDictionary {
    constructor(factory) {
        this.factory = factory;
        this.dict = {};
        this.keys = [];
    }

    get(key) {
        if (!this.dict.hasOwnProperty(key)) {
            this.dict[key] = this.factory(key);
            this.keys.push(key);
        }
        return this.dict[key];
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
            a.push(this.dict[this.keys[i]]);
        }
        return a;
    }
};