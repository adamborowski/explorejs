var expect = require("chai").expect;
var SerieService = require("../app/data/SerieService");

describe("Serie Service", ()=> {
    var service;
    before(()=> {
        var mockData = [];
        for (var i = 0; i < 10; i++) {
            mockData.push({$t: i * 10000});
        }

        var mockAggr = [
            {$s: 0, $e: 30000},
            {$s: 30000, $e: 60000},
            {$s: 60000, $e: 90000},
            {$s: 90000, $e: 12000},
        ];
        service = new SerieService('test', mockData, [{
            levelId: '30s', aggregatedData: mockAggr
        }]);
    });
    describe("Range extraction from raw data", ()=> {
        it("range <20000,80000) should result in $t: 20000 ... $t:70000", ()=> {
            var range = service.getRange('raw', 20000, 80000);
            expect(range[0].$t).to.equal(20000);
            expect(range[range.length - 1].$t).to.equal(70000);
        });
        it("range <20001,79999) should result in $t: 30000 ... $t:70000", ()=> {
            var range = service.getRange('raw', 20001, 79999);
            expect(range[0].$t).to.equal(30000);
            expect(range[range.length - 1].$t).to.equal(70000);
        });
        it("range <19999,80000) should result in $t: 20000 ... $t:80000", ()=> {
            var range = service.getRange('raw', 19999, 80001);
            expect(range[0].$t).to.equal(20000);
            expect(range[range.length - 1].$t).to.equal(80000);
        });

        it('range <100,200) should result in empty set', ()=> {
            var range = service.getRange('raw', 100, 200);
            expect(range).to.be.empty;
        });

        it('should return empty set if out of range', ()=> {
            var range = service.getRange('raw', 100000, 200000);
            expect(range).to.be.empty;
        });
        it('should return empty set if out of range', ()=> {
            var range = service.getRange('raw', -200, -100);
            expect(range).to.be.empty;
        });
    });

    describe("Range extraction from level 30s", ()=> {
        it("range <30000,90000) should result in $s: 30000 ... $e:90000", ()=> {
            var range = service.getRange('30s', 30000, 90000);
            expect(range[0].$s).to.equal(30000);
            expect(range[range.length - 1].$e).to.equal(90000);
        });
        it("range <300001,89999) should result in $s: 30000 ... $e:90000", ()=> {
            var range = service.getRange('30s', 30001, 89999);
            expect(range[0].$s).to.equal(30000);
            expect(range[range.length - 1].$e).to.equal(90000);
        });
        it("range <29999,90001) should result in $s: 0 ... $e:12000", ()=> {
            var range = service.getRange('30s', 29999, 90001);
            expect(range[0].$s).to.equal(0);
            expect(range[range.length - 1].$e).to.equal(12000);
        });
        it('range <100,200) should result in $s:0 ... $e: 30000', ()=> {
            var range = service.getRange('30s', 100, 200);
            expect(range).to.be.deep.equal([service.aggregators.get('30s').aggregatedData[0]]);
        });
        it('range <29000,30100) should result in $s:0 ... $e: 60000', ()=> {
            var range = service.getRange('30s', 29000, 30100);
            var aggregatedData = service.aggregators.get('30s').aggregatedData;
            expect(range).to.be.deep.equal([aggregatedData[0], aggregatedData[1]]);
        });
        it('should return empty set if out of range', ()=> {
            var range = service.getRange('30s', 100000, 200000);
            expect(range).to.be.empty;
        });
        it('should return empty set if out of range', ()=> {
            var range = service.getRange('30s', -200, 0);
            expect(range).to.be.empty;
        });
    });

    describe('start and end times', ()=> {
        it('should return proper startTime', ()=> {
            expect(service.getStartTime()).to.be.equal(0);
            expect(service.getEndTime()).to.be.equal(90000);
        });
    })

});