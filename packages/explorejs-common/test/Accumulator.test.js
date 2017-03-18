var expect = require("chai").expect;
var Accumulator = require("../src/Accumulator");
describe("Accumulator", ()=> {
    it("simple test 1", ()=> {
        var groups = [];
        var acc = new Accumulator((a, b)=>a.g == b.g, g=>groups.push(g));
        var data = [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}, {a: 4, g: 2}, {a: 5, g: 1}, {a: 6, g: 1}];
        acc.processArray(data);
        expect(groups).to.deep.equal([
            [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}],
            [{a: 4, g: 2}],
            [{a: 5, g: 1}, {a: 6, g: 1}]
        ]);
    });
    it("simple test 2", ()=> {
        var groups = [];
        var acc = new Accumulator((a, b)=>a.g == b.g, g=>groups.push(g));
        var data = [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}, {a: 4, g: 2}, {a: 5, g: 1}, {a: 6, g: 2}];
        acc.processArray(data);
        expect(groups).to.deep.equal([
            [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}],
            [{a: 4, g: 2}],
            [{a: 5, g: 1}],
            [{a: 6, g: 2}]
        ]);
    });
    it("one group test", ()=> {
        var groups = [];
        var acc = new Accumulator((a, b)=>a.g == b.g, g=>groups.push(g));
        var data = [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}, {a: 4, g: 1}, {a: 5, g: 1}, {a: 6, g: 1}];
        acc.processArray(data);
        expect(groups).to.deep.equal([
            [{a: 1, g: 1}, {a: 2, g: 1}, {a: 3, g: 1}, {a: 4, g: 1}, {a: 5, g: 1}, {a: 6, g: 1}]
        ]);
    });
    it("one item test", ()=> {
        var groups = [];
        var acc = new Accumulator((a, b)=>a.g == b.g, g=>groups.push(g));
        var data = [{a: 1, g: 1}];
        acc.processArray(data);
        expect(groups).to.deep.equal([
            [{a: 1, g: 1}]
        ]);
    });
    it("no item test", ()=> {
        var groups = [];
        var acc = new Accumulator((a, b)=>a.g == b.g, g=>groups.push(g));
        var data = [];
        acc.processArray(data);
        expect(groups).to.be.empty;
    });
});