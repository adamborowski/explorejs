var gen = require('random-seed');
module.exports = class TestUtil {
    static rng(...items) {
        if (items.length == 1 && typeof items[0] == 'string') {
            items = items[0].match(/\[.*?]|(?:\d+\.?\d*\s+\d+\.?\d*)/g);
            return items.map((str)=> {
                var obj = {};
                if (str.startsWith('[')) {
                    obj.existing = {};
                    var tokens = str.substring(1, str.length - 1).match(/\d+\.?\d*|\->/g);
                    var leftTokens, rightTokens;
                    if (tokens[1] == '->') {
                        leftTokens = tokens.slice(0, 3);
                        rightTokens = tokens.slice(3);
                    }
                    else {
                        leftTokens = tokens.slice(0, 1);
                        rightTokens = tokens.slice(1);
                    }
                    obj.existing.start = Number(leftTokens[0]);
                    obj.existing.end = Number(rightTokens[0]);

                    if (leftTokens.length == 1) {
                        obj.start = Number(leftTokens[0]);
                    }
                    else {
                        obj.start = Number(leftTokens[2]);
                    }
                    if (rightTokens.length == 1) {
                        obj.end = Number(rightTokens[0]);
                    }
                    else {
                        obj.end = Number(rightTokens[2]);
                    }
                    return obj;
                }
                else {
                    var tokens = str.split(/\s+/g);
                    return {
                        start: Number(tokens[0]),
                        end: Number(tokens[1])
                    }
                }
            });
        }
        var r = [];
        if (items.length % 2 == 1) {
            throw new Error('Odd number of numbers, cannot create ranges');
        }
        for (var i = 0; i < items.length; i += 2) {
            r.push({start: items[i], end: items[i + 1]});
        }
        return r;
    }

    static randomRangeSet(size, rand) {
        var cnt = 0;
        var output = [];
        for (var i = 0; i < size; i++) {
            var randomSpace = rand.intBetween(0, 3);
            var randomSize = rand.intBetween(1, 10);
            output.push({start: cnt + randomSpace, end: cnt + randomSpace + randomSize});
            cnt += randomSpace + randomSize;
        }
        return output;
    }


};