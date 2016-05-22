var gen = require('random-seed');
var padding = require('string-padding');
module.exports = class TestUtil {
    static rng(...items) {
        if (items.length == 1 && typeof items[0] == 'string') {
            items = items[0].match(/\[.*?]|(?:\d+\.?\d*\s+\d+\.?\d*)/g) || [];
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

    static randomRangeSet(size, rand, spaceRange, sizeRange) {
        if (spaceRange == null) {
            spaceRange = {start: 0, end: 3};
        }
        if (sizeRange == null) {
            sizeRange = {start: 1, end: 10};
        }

        var genRange = (range)=> {
            if (typeof(range) == 'function') {
                return range();
            }
            return rand.intBetween(range.start, range.end);
        };

        var cnt = 0;
        var output = [];

        function step() {
            var randomSpace = genRange(spaceRange);
            var randomSize = genRange(sizeRange);
            output.push({start: cnt + randomSpace, end: cnt + randomSpace + randomSize});
            cnt += randomSpace + randomSize;
        }

        if (typeof(size) == 'function') {
            do {
                step();
            } while (size(output));
        }
        else {
            for (var i = 0; i < size; i++) {
                step();
            }
        }
        return output;
    }

    static repeat(str, times) {
        var s = "";
        for (var i = 0; i < times; i++) {
            s += str;
        }
        return s;
    }


    static getRangeDrawing(rangeSets, names, scale) {
        var lines = [];
        scale = scale || 6;
        if (names == null) {
            names = "ABCDEFGHIJKLMNOPRSTUWXYZ";
        }
        names = names.split('');
        var max = rangeSets.reduce((a, b)=> {
            return Math.max(a, b.length == 0 ? 0 : b[b.length - 1].end)
        }, 0);

        function putStringIntoArray(array, pos, string) {
            for (var i = 0; i < string.length; i++) {
                array[pos + i] = string[i];
            }
        }

        for (var rangeSet of rangeSets) {
            var line = [];
            var numbers = [];
            for (var i = 0; i <= max * scale; i++) {
                line[i] = " ";
                numbers[i] = " ";

            }
            var previousRangeEnd = -Infinity;
            for (var range of rangeSet) {
                var r = {start: range.start * scale, end: range.end * scale};
                if (previousRangeEnd == range.start) {
                    line[r.start] = '┳';
                } else {
                    line[r.start] = '┏';
                    putStringIntoArray(numbers, r.start, padding(range.start.toString(), 3, ' ', padding.RIGHT));
                }
                putStringIntoArray(numbers, r.end - 2, padding(range.end.toString(), 3, ' ', padding.LEFT));
                line[r.end] = '┓';
                for (var j = r.start + 1; j < r.end; j++) {
                    line[j] = '━';
                }
                previousRangeEnd = range.end;
            }
            line.unshift('├', ' ' + names.shift() + ' ');
            numbers.unshift('│   ');
            numbers.push('  │');
            line.push('  │');

            lines.push(line.join(""));
            lines.push(numbers.join(""));
        }
        var upLine = '┌' + this.repeat('─', (max * scale) + 6) + '┐';
        var dnLine = '└' + this.repeat('─', (max * scale) + 6) + '┘';
        lines.unshift(upLine);
        lines.push(dnLine);
        return lines.join("\n");
    }

    static
    getSwitcher(rand, numItems) {
        return new RandomSwitcher(rand, numItems);
    }

};

class RandomSwitcher {
    constructor(rand, numItems) {
        this.numItems = numItems;
        this.rand = rand;
        this.lastItem = null;
    }

    next() {
        var randomNumber = this.rand.intBetween(0, this.numItems - 2);
        if (randomNumber == this.lastItem) {
            randomNumber++;
        }
        randomNumber = randomNumber % this.numItems;
        this.lastItem = randomNumber;
        return randomNumber;
    }
}