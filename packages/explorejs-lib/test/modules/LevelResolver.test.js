/* global describe */
import * as chai from 'chai';
import {
    getScaleForLevel,
    getScalesForLevels,
    fitLevelForScale,
    fitPrecalculatedLevelsForScale
} from '../../src/modules/LevelResolver';
const expect = chai.expect;

const levels = [
    {id: '10s', step: 10 * 1000},
    {id: '30s', step: 30 * 1000},
    {id: '1m', step: 60 * 1000},
    {id: '30m', step: 30 * 60 * 1000},
    {id: '1h', step: 60 * 60 * 1000},
    {id: '1d', step: 24 * 60 * 60 * 1000},
    {id: '30d', step: 30 * 24 * 60 * 60 * 1000},
    {id: '1y', step: 365 * 24 * 60 * 60 * 1000}
];

describe('LevelResolver', () => {
    it('should return good scale for level', () => {
        expect(getScaleForLevel(levels[0], 10)).to.equal(1000);
        expect(getScaleForLevel(levels[0], 1)).to.equal(10000);
        expect(getScaleForLevel(levels[0], 5)).to.equal(2000);
        expect(getScaleForLevel(levels[1], 10)).to.equal(3000);
    });
    it('should return good scales for levels', () => {
        expect(getScalesForLevels([levels[0], levels[1], levels[2]], 10)).to.deep.equal([
            {
                level: {
                    id: '10s',
                    step: 10000
                },
                scale: 1000
            },
            {
                level: {
                    id: '30s',
                    step: 30000
                },
                scale: 3000
            },
            {
                level: {
                    id: '1m',
                    step: 60000
                },
                scale: 6000
            }
        ]);
    });

    describe('get proper level', () => {
        const puw = 10;

        it('test 1', () => {
            expect(fitLevelForScale(999, levels, puw)).to.equal('raw');
        });
        it('test 2', () => {
            expect(fitLevelForScale(1000, levels, puw)).to.equal('10s');
        });
        it('test 3', () => {
            expect(fitLevelForScale(2999, levels, puw)).to.equal('10s');
        });
        it('test 4', () => {
            expect(fitLevelForScale(3000, levels, puw)).to.equal('30s');
        });
        it('test 5', () => {
            expect(fitLevelForScale(5999, levels, puw)).to.equal('30s');
        });
        it('test 6', () => {
            expect(fitLevelForScale(6000, levels, puw)).to.equal('1m');
        });
        it('test 7', () => {
            expect(fitLevelForScale(179999, levels, puw)).to.equal('1m');
        });
        it('test 8', () => {
            expect(fitLevelForScale(180000, levels, puw)).to.equal('30m');
        });
        it('test 9', () => {
            expect(fitLevelForScale(9999999999999, levels, puw)).to.equal('1y');
        });
        it('test 10', () => {
            const precalculated = getScalesForLevels(levels, 10);

            expect(fitPrecalculatedLevelsForScale(179999, precalculated)).to.equal('1m');
        });

    });

});

