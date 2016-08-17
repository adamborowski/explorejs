import * as chai from 'chai';
import DummyAdapter from "./DummyAdapter";
var expect = chai.expect;

describe("DummyAdapter", () => {
    /**
     * @type {DummyAdapter}
     */
    var adapter;
    beforeEach(()=> {

        adapter = new DummyAdapter(0, 1000, 0.25, 0.5, 1000);
        adapter.dataSource = {
            updateViewState: ()=>null
        }
    });
    it('pan right default', ()=> {
        adapter.panRight();
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([250, 1250]);
    });
    it('pan left default', ()=> {
        adapter.panLeft();
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([-250, 750]);
    });
    it('pan right 0.3', ()=> {
        adapter.panRight(0.3);
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([300, 1300]);
    });
    it('pan left 0.3', ()=> {
        adapter.panLeft(0.3);
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([-300, 700]);
    });
    it('zoom in default', ()=> {
        adapter.zoomIn();
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([250, 750]);
    });
    it('zoom out default', ()=> {
        adapter.zoomOut();
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([-500, 1500]);
    });
    it('zoom in 0.1', ()=> {
        adapter.zoomIn(0.1);
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([450, 550]);
    });
    it('zoom out 0.1', ()=> {
        adapter.zoomOut(0.1);
        expect([adapter.currentStart, adapter.currentEnd]).to.deep.equal([-4500, 5500]);
    });

});