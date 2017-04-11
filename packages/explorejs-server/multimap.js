"use strict";
module.exports = class multimap {
    constructor() {
        this.map = {};
        this.countUnique = 0;
        this.keys = [];
        this.values = [];
    }

    set(key, value) {
        if (this.map.hasOwnProperty(key) == false) {
            this.map[key] = [];
            this.values.push(this.map[key]);
            this.countUnique++;
            this.keys.push(key);
        }

        this.map[key].push(value);
    }

    get(key) {
        return this.map[key];
    }

    getKeys() {
        return this.keys;
    }
}