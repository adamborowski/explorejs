/* global describe, it, before */

import chai from 'chai';
import {MergeOperation} from '../lib/explorejs-common';

chai.expect();

const expect = chai.expect;


describe('Given an instance of my library', () => {
    before(() => {
    });
    describe('when I need something exported in API', () => {
        it('should be available', () => {
            expect(MergeOperation).to.be.not.null;
        });
    });
});
