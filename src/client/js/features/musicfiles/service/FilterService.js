'use strict';

class Filter {
    constructor(id, name) {
        this.name = id;
        this.text = name;
    }

    filter(file) {
        return true;
    }
}

class UnknownFilter extends Filter {
    constructor() {
        super("unknown", "Filter unknown");
    }

    filter(file) {
        return !file.known;
    }
}

class KnownFilter extends Filter {
    constructor() {
        super("known", "Filter known");
    }

    filter(file) {
        return file.known;
    }
}

export default class FilterService {
    constructor() {
        this.filters = [new Filter("off", "Filter off"), new UnknownFilter(), new KnownFilter()];
    }

};
