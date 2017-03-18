const expect = require("chai").expect;
const TestUtil = require('./TestUtil');
const ll = TestUtil.rangesOnLevel.bind(TestUtil);

describe("TestUtil", ()=> {
    describe("applyDiff", ()=> {
        it('case 1', ()=> {
            expect(TestUtil.applyDiff(ll('1d 0 1'), {
                added: ll('1h 0 1'),
                removed: ll('1d 0 1'),
                resized: ll('')
            })).to.deep.equal(ll('1h 0 1'));
        });
        it('case 1', ()=> {
            expect(TestUtil.applyDiff(ll('1d 0 1; 1h 1 4; 1d 4 7'), {
                added: ll('1m 4 5'),
                removed: ll('1d 0 1'),
                resized: ll('1h 2 3 1 4; 1d 5 6 4 7')
            })).to.deep.equal(ll('1h 2 3; 1m 4 5; 1d 5 6'));
        });
    });
});