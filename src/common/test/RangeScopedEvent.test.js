import * as chai from 'chai';

var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

import RangeScopedEvent from "../src/RangeScopedEvent";
import Range from "../src/Range";

describe('RangeScopedEvent', () => {
    /**
     * @var {RangeScopedEvent}
     */
    var event;
    beforeEach(()=> {
        event = new RangeScopedEvent();
    });
    describe('full scenarios', ()=> {
        var listeners;
        beforeEach(()=> {
            listeners = {
                foo_0_1: sinon.spy(),
                foo_0_100: sinon.spy(),
                foo_50_50_point: sinon.spy(),
                foo_30_70: sinon.spy(),
                bar_0_1: sinon.spy(),
                bar_0_100: sinon.spy(),
                bar_50_50_point: sinon.spy(),
                bar_30_70: sinon.spy()
            };
            event.addListener('foo', Range.leftClosed(0, 1), listeners.foo_0_1);
            event.addListener('foo', Range.leftClosed(0, 100), listeners.foo_0_100);
            event.addListener('foo', Range.leftClosed(50, 50), listeners.foo_50_50_point);
            event.addListener('foo', Range.leftClosed(30, 70), listeners.foo_30_70);

            event.addListener('bar', Range.rightClosed(0, 1), listeners.bar_0_1);
            event.addListener('bar', Range.rightClosed(0, 100), listeners.bar_0_100);
            event.addListener('bar', Range.rightClosed(50, 50), listeners.bar_50_50_point);
            event.addListener('bar', Range.rightClosed(30, 70), listeners.bar_30_70);
        });
        it('unsubscribed event', ()=> {
            event.fireEvent('happened', Range.closed(-100, 1000), "something");

            expect(listeners.foo_0_1).to.be.not.called;
            expect(listeners.foo_0_100).to.be.not.called;
            expect(listeners.foo_50_50_point).to.be.not.called;
            expect(listeners.foo_30_70).to.be.not.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('all foo listeners', ()=> {
            event.fireEvent('foo', Range.closed(0, 100), 'foo data');

            expect(listeners.foo_0_1).to.be.called;
            expect(listeners.foo_0_100).to.be.called;
            expect(listeners.foo_50_50_point).to.be.called;
            expect(listeners.foo_30_70).to.be.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('all foo listeners except unreginstered one', ()=> {
            event.removeListener("foo", listeners.foo_0_100);
            event.fireEvent('foo', Range.closed(0, 100), 'foo data');

            expect(listeners.foo_0_1).to.be.called;
            expect(listeners.foo_0_100).to.be.not.called; // unregistered, shouldn't be called anymore
            expect(listeners.foo_50_50_point).to.be.called;
            expect(listeners.foo_30_70).to.be.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('foo listeners from 45 to 55', ()=> {
            event.fireEvent('foo', Range.closed(45, 55), 'foo data');

            expect(listeners.foo_0_1).to.be.not.called;
            expect(listeners.foo_0_100).to.be.called;
            expect(listeners.foo_50_50_point).to.be.called;
            expect(listeners.foo_30_70).to.be.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('leftClosed range listeners from 1 to 30', ()=> {
            event.fireEvent('foo', Range.closed(1, 30), 'foo data');

            expect(listeners.foo_0_1).to.be.not.called;
            expect(listeners.foo_0_100).to.be.called;
            expect(listeners.foo_50_50_point).to.be.not.called;
            expect(listeners.foo_30_70).to.be.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('rightClosed range listeners from 1 to 30', ()=> {
            event.fireEvent('bar', Range.closed(1, 30), 'foo data');

            expect(listeners.foo_0_1).to.be.not.called;
            expect(listeners.foo_0_100).to.be.not.called;
            expect(listeners.foo_50_50_point).to.be.not.called;
            expect(listeners.foo_30_70).to.be.not.called;

            expect(listeners.bar_0_1).to.be.called;
            expect(listeners.bar_0_100).to.be.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });
        it('no listeners from 1000 to 2000', ()=> {
            event.fireEvent('foo', Range.closed(1000, 2000), 'foo data');

            expect(listeners.foo_0_1).to.be.not.called;
            expect(listeners.foo_0_100).to.be.not.called;
            expect(listeners.foo_50_50_point).to.be.not.called;
            expect(listeners.foo_30_70).to.be.not.called;

            expect(listeners.bar_0_1).to.be.not.called;
            expect(listeners.bar_0_100).to.be.not.called;
            expect(listeners.bar_50_50_point).to.be.not.called;
            expect(listeners.bar_30_70).to.be.not.called;
        });

    });
});