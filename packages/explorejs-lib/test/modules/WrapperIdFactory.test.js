import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
chai.use(sinonChai);

import WrapperIdFactory from '../../src/modules/WrapperIdFactory';


describe('WrapperIdFactory', () => {

    it('debug factory', ()=> {
        expect(WrapperIdFactory.debug({
            start: new Date('2015-01-29 12:22:20.789').getTime(),
            end: new Date('2016-07-01 01:01:01.000').getTime(),
            levelId: '1h'
        })).to.equal('1h [2015-01-29 12:22:20.789] [2016-07-01 01:01:01.000]')
    });
    it('optimized factory', ()=> {
        expect(WrapperIdFactory.optimized({
            start: new Date('2015-01-29 12:22:20').getTime(),
            end: new Date('2016-07-01 01:01:01').getTime(),
            levelId: '1h'
        })).to.equal('i5i1ydi8:iq2x05ag:1h')
    });

});