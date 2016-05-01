var expect = require('chai').expect;
var OrderedSegmentArray = require("../src/OrderedSegmentArray");
/**
 * @param leftBoundKey
 * @param rightBoundKey
 * @param leftBoundClosed
 * @param rightBoundClosed
 * @returns {OrderedSegmentArray}
 */
function getArray(leftBoundKey, rightBoundKey, leftBoundClosed, rightBoundClosed) {
    return new OrderedSegmentArray({leftBoundKey, rightBoundKey, leftBoundClosed, rightBoundClosed})
}

describe("OrderedRangeArray test", () => {
    var data;

    before(() => {
        data = [
            [3, 5],
            [5, 6],
            [8, 10],
            [10, 11],
            [11, 12],
            [12, 13],
            [100, 110],
            [200, 210],
            [300, 310],
            [400, 410],
            [500, 510],
            [600, 610],
            [700, 710]

        ];
    });

    // beforeEach(() => {
    // });
    describe("Basic test", () => {
        // it("get range by key should work", () => {
        //     list.insertRange([[]])
        // });
        it("getRange() without parameters should return whole array", () => {
            var list = getArray('0', '1', true, true);
            list._data = data;
            expect(list.getRange()).to.be.equal(data);
        });
    });


    describe('Segment index search', ()=> {
        it('Comparator compilation for word fields', ()=> {
            var list = new OrderedSegmentArray({leftBoundKey: 'foo', rightBoundKey: 'bar'});
            var segment = {foo: 3, bar: 4};
            expect(list._leftBoundComparator(segment, 3)).to.be.equal(0);
            expect(list._rightBoundComparator(segment, 3)).to.be.equal(1);
            expect(list._leftBoundComparator(segment, 4)).to.be.equal(-1);
            expect(list._rightBoundComparator(segment, 4)).to.be.equal(0);
        });
        it('Comparator compilation for digit fields', ()=> {
            var list = new OrderedSegmentArray({leftBoundKey: '0', rightBoundKey: '1'});
            var segment = [3, 4];
            expect(list._leftBoundComparator(segment, 3)).to.be.equal(0);
            expect(list._rightBoundComparator(segment, 3)).to.be.equal(1);
            expect(list._leftBoundComparator(segment, 4)).to.be.equal(-1);
            expect(list._rightBoundComparator(segment, 4)).to.be.equal(0);
        });
    });

    describe('get range of segments', ()=> {
        /**
         * @type {OrderedSegmentArray}
         */
        var list;

        function init(leftClosed, rightClosed) {
            if (arguments.length == 1) {
                rightClosed = leftClosed;
            }
            list = getArray('0', '1', leftClosed, rightClosed);
            list._data = data;
        }

        function expectBounds(leftBound, rightBound) {
            var r = list.getRange(leftBound, rightBound);
            var range = [r[0][0], r[r.length - 1][1]];
            return {
                to: {
                    be: (left, right)=> {
                        expect(range).to.be.deep.equal([left, right]);
                    }
                }
            }
        }

        /*        300     510
         *         ┌───────┐
         *         ┗━━━━━━━┛
         */
        it('at segment, range closed', ()=> {
            init(true);
            expectBounds(300, 510).to.be(300, 510);
        });
        /*        300     510
         *         ┌───────┐
         *         *━━━━━━━*
         */
        it('at segment, range opened', ()=> {
            init(false);
            expectBounds(300, 510).to.be(300, 510);
        });
        /*    150 300     510
         *         ┌───────┐
         *     ┗━━━┛
         */
        it('touching before, range closed', ()=> {
            init(true);
            expectBounds(150, 300).to.be(200, 310);
        });
        /*    150 300     510
         *         ┌───────┐
         *     *━━━*
         */
        it('touching before, range opened', ()=> {
            init(false);
            expectBounds(150, 300).to.be(200, 210);
        });
        /*        300     510  650
         *         ┌───────┐
         *                 ┗━━━┛
         */
        it('touching after, range closed', ()=> {
            init(true);
            expectBounds(510, 650).to.be(500, 610);
        });
        /*        200     510 650
         *         ┌───────┐
         *                 *━━━*
         */
        it('touching after, range opened', ()=> {
            init(false);
            expectBounds(510, 650).to.be(600, 610);
        });
        /*        200     510
         *         ┌───────┐
         *            ┗━┛
         */
        it('inside segment, range closed', ()=> {
            init(true);
            expectBounds(201, 509).to.be(200, 510);
        });
        /*        200     510
         *         ┌───────┐
         *            *━*
         */
        it('inside segment, range opened', ()=> {
            init(false);
            expectBounds(201, 509).to.be(200, 510);
        });
        /*        200     510
         *         ┌───────┐
         *       ┗━━━━━━━━━━━┛
         */
        it('outside segment, range closed', ()=> {
            init(true);
            expectBounds(199, 511).to.be(200, 510);
        });
        /*        200     510
         *         ┌───────┐
         *       *━━━━━━━━━━━*
         */
        it('outside segment, range opened', ()=> {
            init(false);
            expectBounds(199, 511).to.be(200, 510);
        });

        /*     10    11    12    13
         *     ┌─────┐     ┌─────┐
         *           ┌─────┐
         *           ┗━━━━━*
         */
        it('touching 3 segments, range closed at left, opened at right', ()=> {
            init(true, false);
            expectBounds(11, 12).to.be(10, 12);
        });
        /*     10    11    12    13
         *     ┌─────┐     ┌─────┐
         *           ┌─────┐
         *           *━━━━━┛
         *   note! this is particular situation when raw points are queried
         *   if there are points {1,2,3,4,5,6,7,8,9,10}
         *   points are represented by /left bound = right bound/
         *   if you query points with time from 5 to 8,
         *   you want have 5,6,7
         */
        it('touching 3 segments, range opened at left, closed at right', ()=> {
            init(false, true);
            expectBounds(11, 12).to.be(11, 13);
        });
        /*     10    11    12    13
         *     ┌─────┐     ┌─────┐
         *           ┌─────┐
         *           ┗━━━━━┛
         */
        it('touching 3 segments, bounds closed', ()=> {
            init(true);
            expectBounds(11, 12).to.be(10, 13);
        });
        /*     10    11    12    13
         *     ┌─────┐     ┌─────┐
         *           ┌─────┐
         *           *━━━━━*
         */
        it('touching 3 segments, bounds opened', ()=> {
            init(false);
            expectBounds(11, 12).to.be(11, 12);
        });
        /*     10    11    12    13
         *     ┌─────┐     ┌─────┐
         *           ┌─────┐
         *         *━━━━━━━━━*
         */
        it('inside 3 segments, bounds opened', ()=> {
            init(false);
            expectBounds(10.5, 12.5).to.be(10, 13);
        });
    });

    describe('insert range into a gap', ()=> {
        it('insert into gap not touching', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[0, 1], [2, 4], [100, 104], [104, 110]];
            list.insertRange([[50, 51], [52, 55], [55, 58], [60, 61]]);
            expect(list._data).to.be.deep.equal([
                [0, 1], [2, 4],
                [50, 51], [52, 55], [55, 58], [60, 61],
                [100, 104], [104, 110]
            ]);
        });
        it('insert into gap touching both sides', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[0, 1], [2, 4], [100, 104], [104, 110]];
            list.insertRange([[4, 100]]);
            expect(list._data).to.be.deep.equal([
                [0, 1], [2, 4],
                [4, 100],
                [100, 104], [104, 110]
            ]);
        });
        it('insert into gap touching left side', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[0, 1], [2, 4], [100, 104], [104, 110]];
            list.insertRange([[4, 51], [52, 55], [55, 58], [60, 61]]);
            expect(list._data).to.be.deep.equal([
                [0, 1], [2, 4],
                [4, 51], [52, 55], [55, 58], [60, 61],
                [100, 104], [104, 110]
            ]);
        });
        it('insert into gap touching right side', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[0, 1], [2, 4], [100, 104], [104, 110]];
            list.insertRange([[50, 51], [52, 55], [55, 58], [60, 100]]);
            expect(list._data).to.be.deep.equal([
                [0, 1], [2, 4],
                [50, 51], [52, 55], [55, 58], [60, 100],
                [100, 104], [104, 110]
            ]);
        });
        it('insert a point into gap touching both sides', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[100, 104], [104, 110]];
            list.insertRange([[104, 104]]);
            expect(list._data).to.be.deep.equal([
                [100, 104],
                [104, 104],
                [104, 110]
            ]);
        });
        it('insert at the beginnig, not touching', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[100, 104], [104, 110]];
            list.insertRange([[1, 2]]);
            expect(list._data).to.be.deep.equal([
                [1, 2],
                [100, 104], [104, 110]
            ]);
        });
        it('insert at the beginnig, touching', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[100, 104], [104, 110]];
            list.insertRange([[1, 100]]);
            expect(list._data).to.be.deep.equal([
                [1, 100],
                [100, 104], [104, 110]
            ]);
        });
        it('insert at the end, not touching', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[100, 104], [104, 110]];
            list.insertRange([[200, 300]]);
            expect(list._data).to.be.deep.equal([
                [100, 104], [104, 110],
                [200, 300]
            ]);
        });
        it('insert at the end, touching', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[100, 104], [104, 110]];
            list.insertRange([[110, 300]]);
            expect(list._data).to.be.deep.equal([
                [100, 104], [104, 110],
                [110, 300]
            ]);
        });

        it('insert between segments', ()=> {
            var list = getArray('0', '1', true, true);
            list._data = [[0, 1], [2, 4], [100, 104], [104, 110]];
            expect(()=>list.insertRange([[1.5, 1.6], [50, 60]])).to.throw(/You can insert/);
        });

    });
});