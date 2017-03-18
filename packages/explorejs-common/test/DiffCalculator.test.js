var expect = require('chai').expect;
var DiffCalculator = require("../src/DiffCalculator");
var TestUtil = require('./TestUtil');
const ll = TestUtil.rangesOnLevel.bind(TestUtil);
describe("DiffCalculator", () => {
    describe("mergeSortedArrays", () => {
        it('test case 1', ()=> {
            expect(DiffCalculator.mergeSortedArrays([[3, 5, 8, 9], [], [4, 6], [1, 3, 5]])).to.deep.equal(
                [1, 3, 3, 4, 5, 5, 6, 8, 9]
            );
        });
        it('test case 2', ()=> {
            expect(DiffCalculator.mergeSortedArrays([[], [], [], []])).to.deep.equal(
                []
            );
        });
        it('test case 3', ()=> {
            expect(DiffCalculator.mergeSortedArrays([])).to.deep.equal(
                []
            );
        });
        it('test case 3', ()=> {
            expect(DiffCalculator.mergeSortedArrays([[0]])).to.deep.equal(
                [0]
            );
        });
    });
    describe('diffSameRanges', ()=> {
        it('one big replaces many small', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 1 2; 1h 3 4; 1h 5 6'), ll('1h 0 7'))).to.deep.equal({
                added: [],
                removed: ll('1h 3 4; 1h 5 6'),
                resized: ll('1h 0 7 1 2')
            });
        });
        it('one big and one smaller replace many small', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 1 2; 1h 3 4; 1h 5 6'), ll('1h 0 5.6; 1h 5.6 8'))).to.deep.equal({
                added: [],
                removed: ll('1h 3 4;'),
                resized: ll('1h 0 5.6 1 2; 1h 5.6 8 5 6')
            });
        });
        it('one big is replaced by many small', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 0 7'), ll('1h 1 2; 1h 3 4; 1h 5 6'))).to.deep.equal({
                added: ll('1h 3 4; 1h 5 6'),
                removed: [],
                resized: ll('1h 1 2 0 7')
            });
        });
        it('many overlaps', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 0 2; 1h 3 6;'), ll('1h 1 4; 1h 5 7'))).to.deep.equal({
                added: ll(''),
                removed: ll(''),
                resized: ll('1h 1 4 0 2; 1h 5 7 3 6')
            });
        });
        it('no overlaps', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 0 1; 1h 4 5;'), ll('1h 2 3; 1h 6 7'))).to.deep.equal({
                added: ll('1h 2 3; 1h 6 7'),
                removed: ll('1h 0 1; 1h 4 5'),
                resized: ll('')
            });
        });
        it('only small changes, no overlaps', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 1 2; 1h 4 5; 1h 7 8; 1h 9 10; 1h 11 12'), ll('1h 0 1; 1h 3 5; 1h 6 7; 1h 8 10'))).to.deep.equal({
                added: ll('1h 0 1; 1h 6 7'),
                removed: ll('1h 1 2; 1h 7 8; 1h 11 12'),
                resized: ll('1h 3 5 4 5; 1h 8 10 9 10')
            });
        });
        it('one big is replaced by many small + many survived', ()=> {
            expect(DiffCalculator.diffSameRanges(ll('1h 0 1; 1h 2 3; 1h 4 11; 1h 13 14'), ll('1h 0 1; 1h 2 3; 1h 4 5; 1h 6 7; 1h 8 9; 1h 10 12; 1h 13 14'))).to.deep.equal({
                added: ll('1h 6 7; 1h 8 9; 1h 10 12'),
                removed: ll(''),
                resized: ll('1h 4 5 4 11')
            });
        });
    });
    describe('compute', ()=> {
        it('empty case', ()=> {
            expect(DiffCalculator.compute(ll(''), ll(''))).to.deep.equal({
                added: ll(''),
                removed: ll(''),
                resized: ll('')
            });
        });

        it('base test, untouched, unchanged', ()=> {
            expect(DiffCalculator.compute(ll('1h 0 1; 1d 2 3; 1h 4 5; 1m 5 6; 1h 7 8'), ll('1h 0 1; 1d 2 3; 1h 4 5; 1m 5 6; 1h 7 8'))).to.deep.equal({
                added: ll(''),
                removed: ll(''),
                resized: ll('')
            });
        });
        it('base test, touching, unchanged', ()=> {
            expect(DiffCalculator.compute(ll('1h 0 1; 1d 1 2; 1h 2 3; 1m 3 4; 1h 4 5'), ll('1h 0 1; 1d 1 2; 1h 2 3; 1m 3 4; 1h 4 5'))).to.deep.equal({
                added: ll(''),
                removed: ll(''),
                resized: ll('')
            });
        });
        it('base test, one big is replaced by many on different levels', ()=> {
            expect(DiffCalculator.compute(ll('1h 0 10'), ll('1m 0 2; 1m 3 4; 1h 4 5; 1h 6 7; 1d 7 9'))).to.deep.equal({
                added: ll('1m 0 2; 1m 3 4; 1h 6 7; 1d 7 9'),
                removed: ll(''),
                resized: ll('1h 4 5 0 10')
            });
        });
        it('left xor right', ()=> {
            expect(DiffCalculator.compute(ll('1h 0 1; 1d 1 2; 1h 2 3; 1d 3 4'), ll('1d 0 1; 1h 1 2; 1d 2 3; 1h 3 4'))).to.deep.equal({
                added: ll('1d 0 1; 1h 1 2; 1d 2 3; 1h 3 4'),
                removed: ll('1h 0 1; 1d 1 2; 1h 2 3; 1d 3 4'),
                resized: ll('')
            });
        });
        it('zoom in', ()=> {
            expect(DiffCalculator.compute(ll('1d 0 1; 1h 1 4; 1d 4 7'), ll('1h 2 3; 1m 4 5; 1d 5 6'))).to.deep.equal({
                added: ll('1m 4 5'),
                removed: ll('1d 0 1'),
                resized: ll('1h 2 3 1 4; 1d 5 6 4 7')
            });
        });
        it('zoom out', ()=> {
            expect(DiffCalculator.compute(ll('1h 2 3; 1m 4 5; 1d 5 6'), ll('1d 0 1; 1h 1 4; 1d 4 7'))).to.deep.equal({
                added: ll('1d 0 1'),
                removed: ll('1m 4 5'),
                resized: ll('1h 1 4 2 3; 1d 4 7 5 6')
            });
        });

    });
});