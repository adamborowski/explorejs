var expect = require("chai").expect;
var rangeScoped = require("../src/RangeScopedEvent");
var RangeScopedEvent = rangeScoped.RangeScopedEvent;
var Range = rangeScoped.Range;

describe("RangeScopedEventTest", ()=> {
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
});