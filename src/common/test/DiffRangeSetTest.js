var expect = require("chai").expect;
var TestUtil = require("./TestUtil");
var rng = TestUtil.rng;
var DiffRangeSet = require("../src/DiffRangeSet");
var gen = require('random-seed');
var qintervals = require('qintervals');
    describe("DiffRangeSet", ()=> {
    before(()=> {
    });
    describe('_computeNextStep test', ()=> {
        var leftSet = [];
        var rightSet = [];
        var A, B, C, D, E, F, G, K, L, M, N, O, P;
        before(()=> {
            /*
             *  1    / K
             *  2   A  K
             *  3   A  K
             *      A\
             *  5   A  L
             *         L
             *       / L
             *  8   B  L
             *  9   B  L
             *      |  L
             * 11   C  L
             * 12   C  L
             *      |  L
             * 14   D  L
             * 15   D  L
             *      |  L
             * 17   E  L
             * 18   E
             *      |
             * 20   F
             * 21   F\ M
             * 22   F  M
             * 23   F  N
             * 24   F  N
             *       /
             * 26   G
             *      G
             * 28   G
             *       \
             * 30      O
             * 31      O
             *         |
             * 33      P
             * 34      P
             *
             */
            var addLeft = (start, end) => {
                var x = rng(start, end);
                leftSet = leftSet.concat(x);
                return leftSet.length - 1;
            };
            var addRight = (start, end) => {
                var x = rng(start, end);
                rightSet = rightSet.concat(x);
                return rightSet.length - 1;
            };
            A = addLeft(2, 5);
            B = addLeft(8, 9);
            C = addLeft(11, 12);
            D = addLeft(14, 15);
            E = addLeft(17, 18);
            F = addLeft(20, 24);
            G = addLeft(26, 28);
            K = addRight(1, 3);
            L = addRight(5, 17);
            M = addRight(21, 22);
            N = addRight(23, 24);
            O = addRight(31, 31);
            P = addRight(33, 34);
        });
        it('_computeNextStep should move to closer element -1 -1', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, -1, -1)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element -1 K', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, -1, K)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element A K', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, A, K)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element A L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, A, L)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element B L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, B, L)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element C L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, C, L)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element D L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, D, L)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element E L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, E, L)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element F L', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, L)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element F M', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, M)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element F N', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, N)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element G N', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, N)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element G O', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, O)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element G P', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, P)).to.be.null;
        });
        it('_computeNextStep should move to closer element F K', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, K)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element when next are equal', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('6 7 10 11'), rng('8 9 10 11'), 0, 0)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should move to closer element when next are equal', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('8 9 10 11'), rng('6 7 10 11'), 0, 0)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should move to closer element when next and prev are equal', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('8 9 10 11'), rng('8 9 10 11'), 0, 0)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should return null for empty sets', ()=> {
            expect(DiffRangeSet._computeNextStep([], [], 0, 0)).to.be.null;
        });
        it('_computeNextStep should return null for empty left set', ()=> {
            expect(DiffRangeSet._computeNextStep([], rng('0 1 2 3'), 0, 0)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep([], rng('0 1 2 3'), 0, 1)).to.be.null;
        });
        it('_computeNextStep should return good direction at start', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('0 1'), rng('2 3'), -1, -1)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(rng('2 3'), rng('0 1'), -1, -1)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should return good direction at 0 -1', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('0 2   3 6'), rng('3 11'), 0, -1)).to.have.property('kind', 'right');
        });
        it('_computeNextStep should return good direction at -1 0', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('3 11'), rng('0 2   3 6'), -1, 0)).to.have.property('kind', 'left');
        });
        it('_computeNextStep should return good direction at -1 -1', ()=> {
            expect(DiffRangeSet._computeNextStep(rng('0 1 3 13'), rng('0 4   6 9'), -1, -1)).to.have.property('kind', 'left');
        });
    });
    describe("_getOverlapRelation test", ()=> {
        it('basic test', ()=> {
            expect(DiffRangeSet._computeOverlapRelation({start: 0, end: 3}, {start: 2, end: 4}))
                .to.deep.equal({isResizing: true, start: 0, end: 4, isEndChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 0, end: 3}, {start: 4, end: 5}))
                .to.deep.equal({isAfter: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 3, end: 4}, {start: 0, end: 2}))
                .to.deep.equal({isBefore: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 4, end: 5}, {start: 3, end: 7}))
                .to.deep.equal({start: 3, end: 7, isStartChanged: true, isEndChanged: true, isResizing: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 0, end: 4}, {start: 4, end: 5}))
                .to.deep.equal({isResizing: true, start: 0, end: 5, isEndChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 0, end: 4}, {start: 0, end: 5}))
                .to.deep.equal({isResizing: true, start: 0, end: 5, isEndChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 4, end: 5}, {start: 0, end: 5}))
                .to.deep.equal({isResizing: true, start: 0, end: 5, isStartChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 2, end: 5}, {start: 3, end: 4}))
                .to.deep.equal({isIncluded: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 2, end: 5}, {start: 0, end: 4}))
                .to.deep.equal({isResizing: true, start: 0, end: 5, isStartChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 2, end: 3}, {start: 0, end: 5}))
                .to.deep.equal({isResizing: true, start: 0, end: 5, isStartChanged: true, isEndChanged: true});
            expect(DiffRangeSet._computeOverlapRelation({start: 10, end: 11}, {start: 10, end: 11}))
                .to.deep.equal({isEqual: true});

        });
    });
    describe("Add test", ()=> {
        describe('basic cases', ()=> {
            it("simple two non-overlapping ranges", ()=> {
                expect(DiffRangeSet.add(rng('0 2'), rng('3 5'))).to.deep.equal({
                    added: rng('3 5'),
                    removed: [],
                    resized: [],
                    result: rng('[0 2] 3 5')
                });
            });
            it('new ranges "inside" old, non-overlapping', ()=> {
                expect(DiffRangeSet.add(rng('0 1 4 5'), rng('2 3'))).to.deep.equal({
                    added: rng('2 3'),
                    removed: [],
                    resized: [],
                    result: rng('[0 1] 2 3 [4 5]')
                });
            });
            it('new ranges "inside" old, non-overlapping v2', ()=> {
                expect(DiffRangeSet.add(rng('0 1 4 5 8 9'), rng('2 3 6 7'))).to.deep.equal({
                    added: rng('2 3 6 7'),
                    removed: [],
                    resized: [],
                    result: rng('[0 1] 2 3 [4 5] 6 7 [8 9]')
                });
            });
            it('new ranges include earlier and latter, non-overlapping', ()=> {
                expect(DiffRangeSet.add(rng('2 3 6 7 10 11'), rng('0 1 4 5 8 9 12 13'))).to.deep.equal({
                    added: rng('0 1 4 5 8 9 12 13'),
                    removed: [],
                    resized: [],
                    result: rng('0 1 [2 3] 4 5 [6 7] 8 9 [10 11] 12 13')
                });
            });
            it('new ranges are included in existing ranges, touching', ()=> {
                expect(DiffRangeSet.add(rng('2 10'), rng('2 3 3 4 4 5 5 6 6 7 7 8 8 9 9 10'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[2 10]')
                });
            });
            it('new ranges include earlier and latter, some are included in existing ranges', ()=> {
                expect(DiffRangeSet.add(rng('2 3 6 7 10 11'), rng('0 1 4 5 6.4 6.5 8 9 10 11 12 13'))).to.deep.equal({
                    added: rng('0 1 4 5 8 9 12 13'),
                    removed: [],
                    resized: [],
                    result: rng('0 1 [2 3] 4 5 [6 7] 8 9 [10 11] 12 13')
                });
            });
            it('new ranges are quals to the existing ones', ()=> {
                expect(DiffRangeSet.add(rng('0 1 2 3 4 5'), rng('0 1 2 3 4 5'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[0 1] [2 3] [4 5]')
                });
            });
            it('new ranges have quals to the existing ones', ()=> {
                expect(DiffRangeSet.add(rng('0 1 4 5'), rng('0 1 2 3 4 5'))).to.deep.equal({
                    added: rng('2 3'),
                    removed: [],
                    resized: [],
                    result: rng('[0 1] 2 3 [4 5]')
                });
            });
            it("should return info about resized ranges", ()=> {
                expect(DiffRangeSet.add(rng('0 1 4 5'), rng('1 2 3 7'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: rng('[0 1->2] [4->3 5->7]'),
                    result: rng('[0 1->2] [4->3 5->7]')
                });
            });
            it('should merge two ranges', ()=> {
                expect(DiffRangeSet.add(rng('1 2 4 5'), rng('0 3 3 6'))).to.deep.equal({
                    added: [],
                    removed: rng('4 5'),
                    resized: rng('[1->0 2->6]'),
                    result: rng('[1->0 2->6]')
                });
            });
            it("one item resized, one removed due to union", ()=> {
                expect(DiffRangeSet.add(rng('0 3 4 8'), rng('2 5'))).to.deep.equal({
                    added: [],
                    removed: rng('4 8'),
                    resized: rng('[0 3->8]'),
                    result: rng('[0 3->8]')
                });
            });
            it('add one that equals existing', ()=> {
                expect(DiffRangeSet.add(rng('1 2 3 4'), rng('3 4'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[1 2] [3 4]')
                });
            });
            it('adding into empty set', ()=> {
                expect(DiffRangeSet.add([], rng('0 1'))).to.deep.equal({
                    added: rng('0 1'),
                    removed: [],
                    resized: [],
                    result: rng('0 1')
                });
            });
            it('adding into empty set with touch-join', ()=> {
                expect(DiffRangeSet.add([], rng('0 1 1 2'))).to.deep.equal({
                    added: rng('0 2'),
                    removed: [],
                    resized: [],
                    result: rng('0 2')
                });
            });
            it('adding nothing', ()=> {
                expect(DiffRangeSet.add(rng('0 1 2 3'), [])).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[0 1] [2 3]')
                });
            });
            it('adding nothing to nothing', ()=> {
                expect(DiffRangeSet.add([], [])).to.deep.equal({added: [], resized: [], removed: [], result: []});
            });
            it('adding nothing to touching ragnes', ()=> {
                expect(DiffRangeSet.add(rng('0 1 1 2'), [])).to.deep.equal({
                    added: [],
                    removed: rng('1 2'),
                    resized: rng('[0 1->2]'),
                    result: rng('[0 1->2]')
                });
            });
        });
        describe('custom tests', ()=> {
            it('custom 1', ()=> {
                expect(DiffRangeSet.add(rng('2 4 5 6 7 8 9 10 11 13 14 19 20 21'), rng('1 3 4 12 15 16 17 18 22 23 23 24'))).to.deep.equal({
                    added: rng('22 24'),
                    removed: rng('5 6 7 8 9 10 11 13'),
                    resized: rng('[2->1 4->13>]'),
                    result: rng('[2->1 4->13] [14 19] [20 21] 22 24')
                });
            });

            it('custom 2', ()=> {
                expect(DiffRangeSet.add(rng('14 19'), rng('15 16 17 18'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[14 19]')
                });
            });
        });

        describe('iLeft and iRight specified - starting from middle of sets', ()=> {
            it('should start merge from 4 and 0', ()=> {
                expect(DiffRangeSet.add(rng('0 1 2 3 3 5 6 7 8 9 10 11'), rng('7.5 10'), 4, 0)).to.deep.equal({
                    added: [],
                    removed: rng('10 11'),
                    resized: rng('[8->7.5 9->11]'),
                    result: rng('[8->7.5 9->11]')
                });
            });
            it('should merge only left[4...] and right[0...]', ()=> {
                expect(DiffRangeSet.add(rng('0 1 2 3 3 5 6 7 8 9 10 11'), rng('7.5 10'), 4, 0)).to.deep.equal({
                    added: [],
                    removed: rng('10 11'),
                    resized: rng('[8->7.5 9->11]'),
                    result: rng('[8->7.5 9->11]')
                });
            });
            it('should merge only left[1..3] and right[2..3] - not touching', ()=> {
                expect(DiffRangeSet.add(rng('0 3 4 5 7 10 11 13 14 15 18 19 20 21'), rng('0 1 2 3 6 8 9 11 16 17 21 22'), 1, 2, 3, 3)).to.deep.equal({
                    added: [],
                    removed: rng('11 13'),
                    resized: rng('[7->6 10->13]'),
                    result: rng('[4 5] [7->6 10->13]')
                });
            });
            it('should merge only left[1..3] and right[2..3] - touching should not matter', ()=> {
                expect(DiffRangeSet.add(rng('0 3 4 5 7 10 11 13 14 15 18 19 20 21'), rng('0 1 2 4 6 8 9 11 16 17 21 22'), 1, 2, 3, 3)).to.deep.equal({
                    added: [],
                    removed: rng('11 13'),
                    resized: rng('[7->6 10->13]'),
                    result: rng('[4 5] [7->6 10->13]')
                });
            });
            it('should merge only left[1..3] and right[2..3] - overlapping should not matter', ()=> {
                expect(DiffRangeSet.add(rng('0 3 4 5 7 10 11 13 14 15 18 19 20 21'), rng('0 1 2 6 6 8 9 11 16 17 21 22'), 1, 2, 3, 3)).to.deep.equal({
                    added: [],
                    removed: rng('11 13'),
                    resized: rng('[7->6 10->13]'),
                    result: rng('[4 5] [7->6 10->13]')
                });
            });
        });

        describe('random tests', ()=> {

            function randomRangeSet(size) {
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

            var rand = gen.create("DiffRangeSetTest");

            function find(range, array) {
                return array.find((a)=>a.start == range.start && a.end == range.end)
            }
            for (var i = 0; i < 100; i++) {
                it('#' + i, ()=> {
                    var numLeft = rand.intBetween(0, 10);
                    var numRight = rand.intBetween(0, 10);
                    var left = randomRangeSet(numLeft);
                    var right = randomRangeSet(numRight);
                    var ret = DiffRangeSet.add(left, right);
                    var cmp = qintervals.union(left, right).toObjects();
                    var result = ret.result.map((a)=> {
                        return {from: a.start, to: a.end}
                    });
                    expect(cmp).to.deep.equal(result);

                    // to test, try to transform "left" by ret.removed and ret.resized and ret.added to check if it gives same result as qintervals

                    var restore = left.filter((a)=>find(a, ret.removed) == null);
                    for (var o of ret.resized) {
                        var itemInLeft = find(o.existing, left);
                        itemInLeft.start = o.start;
                        itemInLeft.end = o.end;
                    }

                    for (var o of ret.added) {
                        restore.push(o);
                    }
                    restore.sort((a, b)=>a.start - b.start);

                    expect(cmp.map((a)=> {
                        return {start: a.from, end: a.to}
                    })).to.deep.equal(restore);


                });
            }



        });

    });
    describe("Subtract test", ()=> {
        describe('basic cases', ()=> {
            it("simple two non-overlapping ranges", ()=> {
                expect(DiffRangeSet.subtract(rng('0 2'), rng('3 5'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[0 2]')
                });
            });
            it("simple two non-overlapping ranges 2", ()=> {
                expect(DiffRangeSet.subtract(rng('0 2 5 6'), rng('2 5'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: [],
                    result: rng('[0 2] [5 6]')
                });
            });
            it("split middle", ()=> {
                expect(DiffRangeSet.subtract(rng('0 3 4 7'), rng('1 2 5 7'))).to.deep.equal({
                    added: rng('2 3'),
                    removed: [],
                    resized: rng('[0 3->1] [4 7->5]'),
                    result: rng('[0 3->1] 2 3 [4 7->5]')
                });
            });
            it("split one range by many ranges", ()=> {
                expect(DiffRangeSet.subtract(rng('0 7 9 11'), rng('1 2 3 4 5 6 10 11'))).to.deep.equal({
                    added: rng('2 3 4 5 6 7'),
                    removed: [],
                    resized: rng('[0 7->1] [9 11->10]'),
                    result: rng('[0 7->1] 2 3 4 5 6 7 [9 11->10]')
                });
            });
            it("split one range by many ranges v2", ()=> {
                expect(DiffRangeSet.subtract(rng('0 7 9 11'), rng('1 2 10 11'))).to.deep.equal({
                    added: rng('2 7'),
                    removed: [],
                    resized: rng('[0 7->1] [9 11->10]'),
                    result: rng('[0 7->1] 2 7 [9 11->10]')
                });
            });
            it("split one range by many ranges v3", ()=> {
                expect(DiffRangeSet.subtract(rng('0 2 3 5'), rng('1 2 3 4'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: rng('[0 2->1] [3->4 5]'),
                    result: rng('[0 2->1] [3->4 5]')
                });
            });
            it("resize two range by one range", ()=> {
                expect(DiffRangeSet.subtract(rng('0 2 3 5'), rng('1 4'))).to.deep.equal({
                    added: [],
                    removed: [],
                    resized: rng('[0 2->1] [3->4 5]'),
                    result: rng('[0 2->1] [3->4 5]')
                });
            });
            it("remove many ranges covered by one range", ()=> {
                expect(DiffRangeSet.subtract(rng('0 1 2 3 4 5 6 7 8 9'), rng('1 7'))).to.deep.equal({
                    added: [],
                    removed: rng('2 3 4 5 6 7'),
                    resized: [],
                    result: rng('[0 1] [8 9]')
                });
            });
            it("remove all ranges covered by one range", ()=> {
                expect(DiffRangeSet.subtract(rng('0 1 2 3 4 5 6 7 8 9'), rng('1 10'))).to.deep.equal({
                    added: [],
                    removed: rng('2 3 4 5 6 7 8 9'),
                    resized: [],
                    result: rng('[0 1]')
                });
            });
            it("remove all touching ranges", ()=> {
                expect(DiffRangeSet.subtract(rng('1 2 2 10'), rng('1 8 9 19 21 26'))).to.deep.equal({
                    added: [],
                    removed: rng('1 2'),
                    resized: rng('[2->8 10->9]'),
                    result: rng('[2->8 10->9]')
                });
            });
            it("remove range equal to last cutter", ()=> {
                expect(DiffRangeSet.subtract(rng('1 2'), rng('0 1 1 2'))).to.deep.equal({
                    added: [],
                    removed: rng('1 2'),
                    resized: [],
                    result: []
                });
            });
        });
        describe('random tests', ()=> {

            function randomRangeSet(size) {
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

            var rand = gen.create("DiffRangeSetTest subtract");

            function find(range, array) {
                return array.find((a)=>a.start == range.start && a.end == range.end)
            }

            for (var i = 0; i < 100; i++) {
                it('#' + i, ()=> {
                    var numLeft = rand.intBetween(0, 3);
                    var numRight = rand.intBetween(0, 3);
                    var left = randomRangeSet(numLeft);
                    var right = randomRangeSet(numRight);

                    console.log(left);
                    console.log(right);

                    var ret = DiffRangeSet.subtract(left, right);
                    var cmp = qintervals.subtract(left, right).toObjects();
                    console.log('ret', ret);
                    console.log('cmp, ', cmp);
                    var result = ret.result.map((a)=> {
                        return {from: a.start, to: a.end}
                    });
                    expect(cmp).to.deep.equal(result);

                    // to test, try to transform "left" by ret.removed and ret.resized and ret.added to check if it gives same result as qintervals

                    var restore = left.filter((a)=>find(a, ret.removed) == null);
                    for (var o of ret.resized) {
                        var itemInLeft = find(o.existing, left);
                        itemInLeft.start = o.start;
                        itemInLeft.end = o.end;
                    }

                    for (var o of ret.added) {
                        restore.push(o);
                    }
                    restore.sort((a, b)=>a.start - b.start);

                    expect(restore).to.deep.equal(cmp.map((a)=> {
                        return {start: a.from, end: a.to}
                    }));


                });
            }


        });
    });
});