var expect = require("chai").expect;
var CutOperation = require("../src/CutOperation");
describe('CutOperation', ()=> {
    var subject = {start: 4, end: 8};
    it('cutter above', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 0, end: 1})).to.equal('above');
    });
    it('cutter above touching', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 0, end: 4})).to.equal('above')
    });
    it('cut top', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 0, end: 6})).to.equal('top');
    });
    it('cut top touching', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 4, end: 6})).to.equal('top');
    });
    it('cut middle', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 5, end: 6})).to.equal('middle');
    });
    it('cut bottom', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 6, end: 10})).to.equal('bottom');
    });
    it('cut bottom touching', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 6, end: 8})).to.equal('bottom');
    });
    it('cutter below', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 9, end: 10})).to.equal('below');
    });
    it('cutter below touching', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 8, end: 10})).to.equal('below');
    });
    it('cutter equal', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 4, end: 8})).to.equal('remove');
    });
    it('cutter outside', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 0, end: 10})).to.equal('remove');
    });
    it('cutter outside touching top', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 4, end: 10})).to.equal('remove');
    });
    it('cutter outside touching tobottomp', ()=> {
        expect(CutOperation.getCutInfo(subject, {start: 0, end: 8})).to.equal('remove');
    });
});