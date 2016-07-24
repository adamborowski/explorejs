var gen = require('random-seed');
var padding = require('string-padding');
var xspans = require('xspans');
class TestUtil {
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

    static rangesFromRaw(str) {
        str = str.trim();
        if (str.length) {
            return str.split(' ').map(a=>({start: Number(a), end: Number(a)}));
        }
        return [];
    }

    static dataFromStream(dataStr, scale) {
        if (scale == null) {
            scale = 1;
        }
        return dataStr.split(';').map(p=> {
            var d = p.trim().split(' ');
            if (d.length == 3) {
                return {$s: Number(d[0]) * scale, $e: Number(d[1]) * scale, v: Number(d[2])}
            }
            if (d.length == 2) {
                return {$t: Number(d[0]) * scale, v: Number(d[1])}
            }
            throw new RangeError('bad format');
        });
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
        if (typeof names == 'string') {
            names = names.split('');
        }


        var namesWidth = names.reduce((r, a)=>Math.max(a.length, r), 0);


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
                var levelIdLabelWidth = 4;

                if (range.levelId != null && r.end - r.start > levelIdLabelWidth) {
                    putStringIntoArray(numbers, Math.floor((r.start + r.end ) / 2) - levelIdLabelWidth / 2, padding(range.levelId, levelIdLabelWidth, ' ', padding.BOTH));
                }


                if (previousRangeEnd == range.start) {
                    line[r.start] = '┳';
                } else {
                    line[r.start] = '┏';
                    putStringIntoArray(numbers, r.start, padding(range.start.toString(), 3, ' ', padding.RIGHT));
                }
                if (r.end == r.start) {
                    line[r.end] = '●';
                    continue;
                } else {
                    putStringIntoArray(numbers, r.end - 2, padding(range.end.toString(), 3, ' ', padding.LEFT));
                }
                line[r.end] = '┓';
                for (var j = r.start + 1; j < r.end; j++) {
                    line[j] = '━';
                }
                previousRangeEnd = range.end;
            }
            line.unshift('├', ' ' + padding(names.shift(), namesWidth, ' ', padding.RIGHT) + ' ');
            numbers.unshift('│  ' + this.repeat(" ", namesWidth));
            numbers.push('  │');
            line.push('  │');

            lines.push(line.join(""));
            lines.push(numbers.join(""));
        }
        var upLine = '┌' + this.repeat('─', (max * scale + namesWidth) + 5) + '┐';
        var dnLine = '└' + this.repeat('─', (max * scale + namesWidth) + 5) + '┘';
        lines.unshift(upLine);
        lines.push(dnLine);
        return lines.join("\n");
    }

    static getSwitcher(rand, numItems) {
        return new RandomSwitcher(rand, numItems);
    }

    static transformSet(rangeSet, added, removed, resized) {
        function find(range, array) {
            return array.find((a)=>a.start == range.start && a.end == range.end)
        }

        var restore = rangeSet.filter((a)=>find(a, removed) == null);
        for (var o of resized) {
            var itemInLeft = find(o.existing, rangeSet);
            itemInLeft.start = o.start;
            itemInLeft.end = o.end;
        }

        for (var o of added) {
            restore.push(o);
        }
        restore.sort((a, b)=>a.start - b.start);

        restore = xspans.union(restore).toObjects("start", "end");
        return restore;
    }

    static cleanRange(range) {
        return {start: range.start, end: range.end};
    }

    static cleanRangeOnLevel(range) {
        return {start: range.start, end: range.end, levelId: range.levelId};
    }

    static rangeOnLevel(levelId, start, end, existingStart, existingEnd) {
        if (typeof levelId == 'string') {
            var args = levelId.split(' ');
            levelId = args[0];
            start = Number(args[1]);
            end = Number(args[2]);
            existingStart = Number(args[3]);
            existingEnd = Number(args[4]);
        }
        var o = {start: start, end: end, levelId: levelId};
        if (!isNaN(existingStart)) {
            o.existing = {start: existingStart, end: existingEnd, levelId: levelId};
        }
        return o;
    }

    static rangeWithoutLevel(start, end, existingStart, existingEnd) {
        if (typeof start == 'string') {
            var args = start.split(' ');
            start = Number(args[0]);
            end = Number(args[1]);
            existingStart = Number(args[2]);
            existingEnd = Number(args[3]);
        }
        var o = {start: start, end: end};
        if (!isNaN(existingStart)) {
            o.existing = {start: existingStart, end: existingEnd};
        }
        return o;
    }

    static rangesOnLevel(ranges, scale) {
        if (scale == null) {
            scale = 1;
        }
        return ranges.split(';').filter(a=>a).map(a=> {
            var rangeOnLevel = this.rangeOnLevel(a.trim());
            rangeOnLevel.start *= scale;
            rangeOnLevel.end *= scale;
            if (rangeOnLevel.existing) {
                rangeOnLevel.existing.start *= scale;
                rangeOnLevel.existing.end *= scale;
            }
            return rangeOnLevel
        });
    }

    static rangesWithoutLevel(ranges, scale) {
        if (scale == null) {
            scale = 1;
        }
        return ranges.split(';').filter(a=>a).map(a=> {
            var rangeOnLevel = this.rangeWithoutLevel(a.trim());
            rangeOnLevel.start *= scale;
            rangeOnLevel.end *= scale;
            if (rangeOnLevel.existing) {
                rangeOnLevel.existing.start *= scale;
                rangeOnLevel.existing.end *= scale;
            }
            return rangeOnLevel
        });
    }

    static arrayToObject(array, keyGen, valueGen) {
        var res = {};
        for (var item of array) {
            res[keyGen(item)] = valueGen(item);
        }
        return res;
    }

    static mapObject(object, keyMap, valueMap) {
        var a = {};
        for (var key in object) {
            //noinspection JSUnfilteredForInLoop
            var newKey = keyMap ? keyMap(key) : key;
            a[newKey] = valueMap ? valueMap(object[key]) : object[key];
        }
        return a;
    }

    static identity(self) {
        return self;
    }

    static mapObjectValues(object, map) {
        var r = [];
        if (map == null) {
            map = this.identity;
        }
        for (var key in object) {
            r.push(map(object[key]));
        }
        return r;
    }


}

module.exports = TestUtil;

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