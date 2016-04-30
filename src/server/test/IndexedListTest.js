var expect = require("chai").expect;
var IndexedList = require("../app/utils/IndexedList");

describe("Serie Service", ()=> {
    var list;
    before(()=> {
        list = new IndexedList();
    });
    describe("Basic test", ()=> {
        it("should have consistent state indside", ()=> {
            list.add('apple', 1);
            list.add('peach', 2);
            list.add('pine', 3);
            list.remove('apple');
            list.set('peach', 'peach-2');
            expect(list.values).to.be.deep.equal([3, 'peach-2']);
            expect(list.keys).to.be.deep.equal(['pine', 'peach']);
            expect(list.dict).to.be.deep.equal({pine: 3, peach: 'peach-2'});

            var eachArr = [];
            list.each((key, value, index)=>eachArr.push({key: key, value: value, index: index}));
            expect(eachArr).to.be.deep.equal([
                {
                    key: 'pine', value: 3, index: 0
                },
                {
                    key: 'peach', value: 'peach-2', index: 1
                }]);
        });
    });
});