var expect = require("chai").expect;
var DiffRangeSet = require("../src/DiffRangeSet");

function rng(...items) {
    if (items.length == 1 && typeof items[0] == 'string') {
        items = items[0].split(' ').map(Number);
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
        it('should move to the right element which is closer', ()=> {
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, -1, -1)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, -1, K)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, A, K)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, A, L)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, B, L)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, C, L)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, D, L)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, E, L)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, L)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, M)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, N)).to.have.property('kind', 'left');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, N)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, O)).to.have.property('kind', 'right');
            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, G, P)).to.be.null;

            expect(DiffRangeSet._computeNextStep(leftSet, rightSet, F, K)).to.have.property('kind', 'right');
        });
    });
    describe("Add test", ()=> {
        it("should return info about added ranges", ()=> {
            var test = DiffRangeSet.add(rng('0 2'), rng('3 5'))
            expect(test.added).to.be.deep.equal(rng('3 5'));
        });
        it("should return info about removed ranges", ()=> {

        });
        it("should return info about resized ranges", ()=> {

        });
        it("one item resized, one removed due to union", ()=> {
            var test1 = DiffRangeSet.add(rng('0 3'), rng('2 5'))

        });

    });
});