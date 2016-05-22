var gen = require('random-seed');
var padding = require('string-padding');
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
        names = names.split('');
        var max = -Infinity;

        function putStringIntoArray(array, pos, string) {
            for (var i = 0; i < string.length; i++) {
                array[pos + i] = string[i];
            }
        }

        for (var rangeSet of rangeSets) {
            var last = rangeSet[rangeSet.length - 1].end;
            max = Math.max(max, last);
            var line = [];
            var numbers = [];
            for (var i = 0; i <= last * scale; i++) {
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
            lines.push(line.join(""));
            lines.push(numbers.join(""));
        }
        var upLine = '┌' + this.repeat('─', (max * scale) + 6);
        var dnLine = '└' + this.repeat('─', (max * scale) + 6);
        lines.unshift(upLine);
        lines.push(dnLine);
        return lines.join("\n");
    }


};