var expect = require("chai").expect;
var Range = require('../src/Range');

describe("Range", ()=> {
    describe("Range hasCommon test", ()=> {
        describe('range bounds are disjoint', ()=> {
            it("a inside b ", ()=> {
                expect(Range.opened(2, 3).hasCommon(Range.opened(1, 4))).to.be.ok;
            });
            it("a surrounding b", ()=> {
                expect(Range.opened(1, 4).hasCommon(Range.opened(2, 3))).to.be.ok;
            });
            it("a before b, common part", ()=> {
                expect(Range.opened(1, 3).hasCommon(Range.opened(2, 4))).to.be.ok;
            });
            it("a after b, common part", ()=> {
                expect(Range.opened(2, 4).hasCommon(Range.opened(1, 3))).to.be.ok;
            });
            it("a before b, no common", ()=> {
                expect(Range.opened(1, 2).hasCommon(Range.opened(3, 4))).to.be.not.ok;
            });
            it("a after b, no common", ()=> {
                expect(Range.opened(3, 4).hasCommon(Range.opened(1, 2))).to.be.not.ok;
            });
        });
        describe('range bounds are common, bounds opened', ()=> {
            it("a == b ", ()=> {
                expect(Range.opened(1, 4).hasCommon(Range.opened(1, 4))).to.be.ok;
            });
            it("a before b, touching", ()=> {
                expect(Range.opened(1, 2).hasCommon(Range.opened(2, 3))).to.be.not.ok;
            });
            it("a after b, touching", ()=> {
                expect(Range.opened(2, 3).hasCommon(Range.opened(1, 2))).to.be.not.ok;
            });
            it("a starts before b, finish together", ()=> {
                expect(Range.opened(1, 4).hasCommon(Range.opened(2, 4))).to.be.ok;
            });
            it("a finishes after b, start together", ()=> {
                expect(Range.opened(1, 4).hasCommon(Range.opened(1, 3))).to.be.ok;
            });
        });
        describe('range bounds are common, bounds closed', ()=> {
            it("a == b ", ()=> {
                expect(Range.closed(1, 4).hasCommon(Range.closed(1, 4))).to.be.ok;
            });
            it("a before b, touching", ()=> {
                expect(Range.closed(1, 2).hasCommon(Range.closed(2, 3))).to.be.ok;
            });
            it("a after b, touching", ()=> {
                expect(Range.closed(2, 3).hasCommon(Range.closed(1, 2))).to.be.ok;
            });
            it("a starts before b, finish together", ()=> {
                expect(Range.closed(1, 4).hasCommon(Range.closed(2, 4))).to.be.ok;
            });
            it("a finishes after b, start together", ()=> {
                expect(Range.closed(1, 4).hasCommon(Range.closed(1, 3))).to.be.ok;
            });
        });
        describe('range bounds are common, bounds opened and closed', ()=> {
            it("opened and closed tests", ()=> {
                expect(Range.opened(1, 2).hasCommon(Range.closed(2, 3))).to.be.not.ok;
                expect(Range.closed(1, 2).hasCommon(Range.opened(2, 3))).to.be.not.ok;
                expect(Range.opened(1, 2).hasCommon(Range.opened(2, 3))).to.be.not.ok;
                expect(Range.closed(1, 2).hasCommon(Range.closed(2, 3))).to.be.ok;

                expect(Range.opened(1, 2).hasCommon(Range.closed(3, 4))).to.be.not.ok;
                expect(Range.closed(1, 2).hasCommon(Range.opened(3, 4))).to.be.not.ok;
                expect(Range.opened(1, 2).hasCommon(Range.opened(3, 4))).to.be.not.ok;
                expect(Range.closed(1, 2).hasCommon(Range.closed(3, 4))).to.be.not.ok;
            });
        });
    });
    describe('isBefore', ()=> {
        describe('touching ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.opened(1, 2))).to.be.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.opened(1, 2))).to.be.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.closed(1, 2))).to.be.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.closed(1, 2), true)).to.be.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.opened(1, 2), true)).to.be.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.opened(1, 2), true)).to.be.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.closed(1, 2), true)).to.be.ok;
            });
        });
        describe('touching ranges in decreasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(1, 2).isBefore(Range.closed(0, 1))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(1, 2).isBefore(Range.opened(0, 1))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(1, 2).isBefore(Range.opened(0, 1))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(1, 2).isBefore(Range.closed(0, 1))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(1, 2).isBefore(Range.closed(0, 1), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(1, 2).isBefore(Range.opened(0, 1), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(1, 2).isBefore(Range.opened(0, 1), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(1, 2).isBefore(Range.closed(0, 1), true)).to.be.not.ok;
            });
        });
        describe('overlapping ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1.5).isBefore(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1.5).isBefore(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1.5).isBefore(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1.5).isBefore(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1.5).isBefore(Range.closed(1, 2), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1.5).isBefore(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1.5).isBefore(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1.5).isBefore(Range.closed(1, 2), true)).to.be.not.ok;
            });
        });
        describe('not touching ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.closed(2, 3))).to.be.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.opened(2, 3))).to.be.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.opened(2, 3))).to.be.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.closed(2, 3))).to.be.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.closed(2, 3), true)).to.be.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1).isBefore(Range.opened(2, 3), true)).to.be.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.opened(2, 3), true)).to.be.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1).isBefore(Range.closed(2, 3), true)).to.be.ok;
            });
        });
        describe('not touching ranges in decreasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(2, 3).isBefore(Range.closed(0, 1))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(2, 3).isBefore(Range.opened(0, 1))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(2, 3).isBefore(Range.opened(0, 1))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(2, 3).isBefore(Range.closed(0, 1))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(2, 3).isBefore(Range.closed(0, 1), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(2, 3).isBefore(Range.opened(0, 1), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(2, 3).isBefore(Range.opened(0, 1), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(2, 3).isBefore(Range.closed(0, 1), true)).to.be.not.ok;
            });
        });
    });
    describe('isAfter', ()=> {
        describe('touching ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.closed(1, 2), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.closed(1, 2), true)).to.be.not.ok;
            });
        });
        describe('touching ranges in decreasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(1, 2).isAfter(Range.closed(0, 1))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(1, 2).isAfter(Range.opened(0, 1))).to.be.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(1, 2).isAfter(Range.opened(0, 1))).to.be.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(1, 2).isAfter(Range.closed(0, 1))).to.be.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(1, 2).isAfter(Range.closed(0, 1), true)).to.be.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(1, 2).isAfter(Range.opened(0, 1), true)).to.be.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(1, 2).isAfter(Range.opened(0, 1), true)).to.be.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(1, 2).isAfter(Range.closed(0, 1), true)).to.be.ok;
            });
        });
        describe('overlapping ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1.5).isAfter(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1.5).isAfter(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1.5).isAfter(Range.opened(1, 2))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1.5).isAfter(Range.closed(1, 2))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1.5).isAfter(Range.closed(1, 2), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1.5).isAfter(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1.5).isAfter(Range.opened(1, 2), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1.5).isAfter(Range.closed(1, 2, true))).to.be.not.ok;
            });
        });
        describe('not touching ranges in increasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.closed(2, 3))).to.be.not.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.opened(2, 3))).to.be.not.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.opened(2, 3))).to.be.not.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.closed(2, 3))).to.be.not.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.closed(2, 3), true)).to.be.not.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(0, 1).isAfter(Range.opened(2, 3), true)).to.be.not.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.opened(2, 3), true)).to.be.not.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(0, 1).isAfter(Range.closed(2, 3), true)).to.be.not.ok;
            });
        });
        describe('not touching ranges in decreasing order', ()=> {
            it('closed closed', ()=> {
                expect(Range.closed(2, 3).isAfter(Range.closed(0, 1))).to.be.ok;
            });
            it('closed opened', ()=> {
                expect(Range.closed(2, 3).isAfter(Range.opened(0, 1))).to.be.ok;
            });
            it('opened opened', ()=> {
                expect(Range.opened(2, 3).isAfter(Range.opened(0, 1))).to.be.ok;
            });
            it('opened closed', ()=> {
                expect(Range.opened(2, 3).isAfter(Range.closed(0, 1))).to.be.ok;
            });
            it('closed closed + touching', ()=> {
                expect(Range.closed(2, 3).isAfter(Range.closed(0, 1), true)).to.be.ok;
            });
            it('closed opened + touching', ()=> {
                expect(Range.closed(2, 3).isAfter(Range.opened(0, 1), true)).to.be.ok;
            });
            it('opened opened + touching', ()=> {
                expect(Range.opened(2, 3).isAfter(Range.opened(0, 1), true)).to.be.ok;
            });
            it('opened closed + touching', ()=> {
                expect(Range.opened(2, 3).isAfter(Range.closed(0, 1), true)).to.be.ok;
            });
        });
    })
});