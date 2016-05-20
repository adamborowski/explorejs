var expect = require("chai").expect;
var TestUtil = require('./TestUtil');
var rng = TestUtil.rng;
var ParallelRangeSetIterator = require("../src/ParallelRangeSetIterator");
describe('ParallelRangeSetIterator', ()=> {
    describe('Example cases', ()=> {
        /**
         * @type {ParallelRangeSetIterator}
         */
        var iterator;
        var leftSet;
        var rightSet;
        var steps;

        function addStep(iterator) {
            steps.push([iterator.Left, iterator.Right, iterator.LeftMoved ? 'left' : 'right'])
        }

        var addLeft = (start, end) => {
            var x = rng(start, end);
            leftSet = leftSet.concat(x);
            return x[0];
        };
        var addRight = (start, end) => {
            var x = rng(start, end);
            rightSet = rightSet.concat(x);
            return x[0];
        };

        var A, B, C, D, E, F, G, K, L, M, N, O, P;
        beforeEach(()=> {
            leftSet = []
            rightSet = [];
            steps = [];
        });


        it('simple iteration without adding elements', ()=> {

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
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            while (iterator.next()) {
                addStep(iterator);
            }
            expect(steps).to.deep.equal([
                [null, K, 'right'],
                [A, K, 'left'],
                [A, L, 'right'],
                [B, L, 'left'],
                [C, L, 'left'],
                [D, L, 'left'],
                [E, L, 'left'],
                [F, L, 'left'],
                [F, M, 'right'],
                [F, N, 'right'],
                [G, N, 'left'],
                [G, O, 'right'],
                [G, P, 'right']
            ]);
        });
        it('constrained iteration without adding elements', ()=> {

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
            iterator = new ParallelRangeSetIterator(leftSet, rightSet, {
                startLeft: 2,
                startRight: 1,
                endLeft: 5,
                endRight: 2
            });
            while (iterator.next()) {
                addStep(iterator);
            }
            expect(steps).to.deep.equal([
                [B, L, 'right'],
                [C, L, 'left'],
                [D, L, 'left'],
                [E, L, 'left'],
                [F, L, 'left'],
                [F, M, 'right']
            ]);
        });
        it('constrained iteration with adding elements', ()=> {

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
            var X = {start: 14.5, end: 14.6};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet, {
                startLeft: 2,
                startRight: 1,
                endLeft: 5,
                endRight: 3
            });
            while (iterator.next()) {
                addStep(iterator);
                if (iterator.Current == D) {
                    iterator.insertAsNextLeft(X);
                }
            }
            expect(steps).to.deep.equal([
                [B, L, 'right'],
                [C, L, 'left'],
                [D, L, 'left'],
                [X, L, 'left'],
                [E, L, 'left'],
                [F, L, 'left'],
                [F, M, 'right'],
                [F, N, 'right']
            ]);
        });
        it('simple iteration with adding elements', ()=> {
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
             * 22   F  M // X
             * 23   F  N // X
             * 24   F  N // X
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
            var X = {start: 22, end: 24};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            while (iterator.next()) {
                addStep(iterator);
                switch (iterator.Current) {
                    case M:
                        iterator.insertAsNextLeft(X);
                        break;
                }
            }
            expect(steps).to.deep.equal([
                [null, K, 'right'],
                [A, K, 'left'],
                [A, L, 'right'],
                [B, L, 'left'],
                [C, L, 'left'],
                [D, L, 'left'],
                [E, L, 'left'],
                [F, L, 'left'],
                [F, M, 'right'],
                [X, M, 'left'],
                [X, N, 'right'],
                [G, N, 'left'],
                [G, O, 'right'],
                [G, P, 'right']
            ]);
        });

        it('iteration for subtract case - 3 ranges divided by 3 another ranges', ()=> {
            A = addLeft(1, 4);
            B = addLeft(11, 14);
            C = addLeft(21, 24);
            K = addRight(2, 3);
            L = addRight(12, 13);
            M = addRight(22, 23);
            N = addRight(32, 33);
            var XA = {start: 3, end: 4};
            var XB = {start: 13, end: 14};
            var XC = {start: 23, end: 24};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            while (iterator.next()) {
                addStep(iterator);
                switch (iterator.Current) {
                    case A:
                        iterator.insertAsNextLeft(XA);
                        break;
                    case B:
                        iterator.insertAsNextLeft(XB);
                        break;
                    case C:
                        iterator.insertAsNextLeft(XC);
                        break;
                }
            }
            expect(steps).to.deep.equal([
                [A, null, 'left'],
                [A, K, 'right'],
                [XA, K, 'left'],
                [B, K, 'left'],
                [B, L, 'right'],
                [XB, L, 'left'],
                [C, L, 'left'],
                [C, M, 'right'],
                [XC, M, 'left'],
                [XC, N, 'right'],
            ]);
        });

        it('adding more steps at once', ()=> {
            A = addLeft(1, 2);
            B = addLeft(11, 19);
            C = addLeft(21, 29);
            K = addRight(1, 10);
            L = addRight(15, 20);
            var XB1 = {start: 12, end: 13};
            var XB2 = {start: 14, end: 15};
            var XB3 = {start: 16, end: 17};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            while (iterator.next()) {
                addStep(iterator);
                switch (iterator.Current) {
                    case B:
                        iterator.insertAsNextLeft(XB1);
                        iterator.insertAsNextLeft(XB2);
                        iterator.insertAsNextLeft(XB3);
                        break;
                }
            }
            expect(steps).to.deep.equal([
                [A, null, 'left'],
                [A, K, 'right'],
                [B, K, 'left'],
                [XB1, K, 'left'],
                [XB2, K, 'left'],
                [XB2, L, 'right'],
                [XB3, L, 'left'],
                [C, L, 'left']
            ]);
        });
        it('inserting into empty set', ()=> {
            var XB1 = {start: 12, end: 13};
            var XB2 = {start: 14, end: 15};
            var XB3 = {start: 16, end: 17};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            iterator.insertAsNextLeft(XB1);
            iterator.insertAsNextLeft(XB2);
            iterator.insertAsNextLeft(XB3);
            while (iterator.next()) {
                addStep(iterator);
            }
            expect(steps).to.deep.equal([
                [XB1, null, 'left'],
                [XB2, null, 'left'],
                [XB3, null, 'left']
            ]);
        });
        it('empty iteration', ()=> {
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            expect(iterator.next()).to.be.false;
        });

        it('left empty, right non empty, inserting left in meanwhile', ()=> {
            K = addRight(0, 4);
            L = addRight(10, 20);
            var XB1 = {start: 10, end: 11};
            var XB2 = {start: 20, end: 21};
            iterator = new ParallelRangeSetIterator(leftSet, rightSet);
            while (iterator.next()) {
                addStep(iterator);
                switch (iterator.Current) {
                    case L:
                        iterator.insertAsNextLeft(XB1);
                        iterator.insertAsNextLeft(XB2);
                        break;
                }
            }
            expect(steps).to.deep.equal([
                [null, K, 'right'],
                [null, L, 'right'],
                [XB1, L, 'left'],
                [XB2, L, 'left']
            ]);
        });

    });
});