class IndexedList {
    constructor() {
      this._values = [];
      this._keys = [];
      this._dict = {};
    }

    /**
     * @param array
     * @param key
     * @return {IndexedList}
     */
    static fromArray(array, key) {
      var l = new IndexedList();
      for (var item of array) {
        l.add(item[key], item);
      }
      return l;
    }

    add(key, item) {
      if (!this.contains(key)) {
        this.set(key, item);
      }
        else {
        throw new Error('Cannot duplicate key when adding');
      }
    }

    set(key, item) {
      if (this.contains(key)) {
        this.remove(key);
      }
      this._values.push(item);
      this._keys.push(key);
      this._dict[key] = item;
    }

    remove(key) {
      var value = this._dict[key];
      delete this._dict[key];
      this._values.splice(this._values.indexOf(value), 1);
      this._keys.splice(this._keys.indexOf(key), 1);
    }

    contains(key) {
      return this._dict.hasOwnProperty(key);
    }

    get values() {
      return this._values;
    }

    get keys() {
      return this._keys;
    }

    get dict() {
      return this._dict;
    }


    get(key) {
      return this._dict[key];
    }


    each(callback) {
      for (var i = 0; i < this._values.length; i++) {
        callback(this._keys[i], this._values[i], i);
      }
    }
}
module.exports = IndexedList;
