import DiffRangeSet from 'explorejs-common/src/DiffRangeSet';
import FactoryDictonary from 'explorejs-common/src/FactoryDictionary';
import WrapperIdFactory from './WrapperIdFactory';
import DataUtil from "../data/DataUtil";
import {last} from 'explorejs-common/src/Array';
/**
 * @typedef {{start, end, levelId, data}} WrapperType
 * @typedef {{removed, resized, added}} DiffType
 */
/**
 * This is the mandatory proxy between DataSource(extract data from cache for projection changes) and Chart update implementation
 * every data point coming from cache must be wrapped, has to have id assigned (from:to:level)
 * the proxy is bidirectional, it means that every created point for chart has to be registered, every point to remove
 * from chart has to be unregistered
 * In the future we can optimize the algorithm
 *  1. to not interact with this class, when points comes from the middle of
 * changed range.
 *  2. to not extract data for removed ranges if they are in the middle of changed range. - many chart impementations
 *  can just drop data between a and b
 *  We do not optimize it for now, so every added and removed point during the change is extracted from cache and wrapped
 *  to exactly match data in integrated chart
 */
export default class WrapperCache {
    constructor() {
        /**
         * @field FactoryDictonary<PointRegistry> WrapperCache@registers
         */
        this.registers = new FactoryDictonary(registerId=>new PointRegistry(registerId));
        this.idFactory = WrapperIdFactory.debug;
    }

    /**
     * Insert new wrapper
     * @param dataPoint {*} raw data point
     * @param ranges {Range[]} wrapper ranges
     * @param levelId {string} id of data cache level
     * @return {DiffRangeSetResultType} if wrapper was not registered - the wrapper itself. If the wrapper was registered - diff information
     * Note that wrapper is registered only if it is only part of whole data point
     * @example If there is a register for [10s 0 10] with fragment wrappers [10s 0 4] and [10s 6 10] we know that another point (ex. [2s4 6]) is present on chart
     * Next, we scroll out, data from level 2s disappear, so we are about to insert [10s 4 6] fragment which is the missing part of the register.
     * We find proper register for it, merge the wrapper into the register, then we realize that now we have full data point covered, so we can *remove the register*
     * @example having one 10s aggregation on chart and 1s 2 3; 1s 4 5; 1s 6 7 in cache, when going to zoom,
     *  1s 2 3; 1s 4 5; 1s 6 7 have to be added, but 10s 2 3; 10s 4 5; 10s 6 7 have to be removed
     *  this 2 3; 4 5; 6 7; are wrappers of the same point
     */
    registerRangesForPoint(dataPoint, ranges, levelId) {
        if (ranges.length == 0) {
            return {removed: [], resized: [], added: []};
        }
        // assert
        var dataRange = DataUtil.boundGetter(levelId).bounds(dataPoint);
        if (ranges[0].end < dataRange.start || last(ranges).end > dataRange.end) {
            throw new Error('Ranges have to be constrained to one data point');
        }

        var wrappers = ranges.map(r=>this._constructWrapper(dataPoint, r.start, r.end, levelId));
        if (representsFullWrapper(wrappers)) {
            // this wrapper doesn't need to be registered at the moment, because it covers whole point
            return {removed: [], resized: [], added: wrappers}
        }
        else {
            var registerId = this.idFactory(makeFullWrapper(dataPoint, levelId));
            /**
             * @type {PointRegistry}
             */
            var register = this.registers.get(registerId);
            if (register.isEmpty()) {
                register.insertInitialWrappers(wrappers);
                // this is the first wrapper for this data point
                return {removed: [], resized: [], added: wrappers};
            }
            else {
                /* this is not first wrapper in the register, adding if may cause different results
                 * 1. remove whole register because new wrapper is complement to existing ones
                 * 2. just add wrapper because it doesn't touch existing ones
                 * 3. resize exisiting wrapper becaue it touches existing one
                 * 4. remove existing wrapper because it fills a gap between two wrappers
                 */
                var diff = register.insertWrappers(wrappers);
                if (diff.result.length == 0) {
                    throw new Error('Assertion failed: after adding wrapper there should\'t be empty result');
                }

                if (diff.result.length == 1 && representsFullWrapper(diff.result)) {
                    // after merge this wrapper, we no longer need the register because it is no longer fragmented
                    this.registers.remove(registerId);
                }
                delete diff.result;// this result is meaningless outside the wrapper cache
                return diff;
            }

        }
    }

    /**
     * Unregister data point for specified range, which may share the same data point with other wrappers in the cache.
     * @param dataPoint {*} raw data point
     * @param ranges {Range[]} wrapper ranges
     * @param levelId {string} id of data cache level
     * @return {DiffType} diff as a result of range subtraction
     */
    unregisterRangesForPoint(dataPoint, ranges, levelId) {
        if (ranges.length == 0) {
            return {removed: [], resized: [], added: []};
        }
        // assert
        var dataRange = DataUtil.boundGetter(levelId).bounds(dataPoint);
        if (ranges[0].end < dataRange.start || last(ranges).end > dataRange.end) {
            throw new Error('Ranges have to be constrained to one data point');
        }
        var wrappers = ranges.map(r=>this._constructWrapper(dataPoint, r.start, r.end, levelId));
        const fullWrapper = makeFullWrapper(dataPoint, levelId);
        var registerId = this.idFactory(fullWrapper); //todo try to make id only once per data point (maybe by @code SerieCache#putData)
        if (this.registers.has(registerId)) {
            var register = this.registers.get(registerId);
            var diff = register.removeWrappers(wrappers);
            /* if we remove wrapper from registry:
             * 1. whole registry is removed, if there are no more wrappers
             * 2. other wrapper may get resized, if this wrapper touched it before
             * 3. new wrapper may be added, if this wrapper created a gap after removing
             * 4. the wrapper is just removed without consequences, if it didn't touch other wrappers
             */
            if (diff.result.length == 0) { // case 1
                this.registers.remove(registerId);
            }
            delete diff.result;// this result is meaningless outside the wrapper cache
            return diff; // case 1, 2, 3, 4
        }
        else if (!representsFullWrapper(wrappers)) {
            // we remove only fragment from point which is not registered, so first we have to add this element, then remove element
            var newRegister = this.registers.get(registerId);
            newRegister.insertInitialWrappers([fullWrapper]);
            var diff = newRegister.removeWrappers(wrappers);
            delete diff.result;
            return diff;
        }
        else {
            return {removed: wrappers, resized: [], added: []};
        }
    }

    /**
     * constructs proper wrapper object for specified data point, constrained to specified range
     * @param dataPoint {*}
     * @param start {number}
     * @param end {number}
     * @param levelId {string}
     * @return {WrapperType}
     */
    _constructWrapper(dataPoint, start, end, levelId) {
        var wrapper = {
            data: dataPoint,
            start: start,
            end: end,
            levelId: levelId
        };
        wrapper.id = this.idFactory(wrapper);
        return wrapper
    }

}
/**
 * Checks if given wrapper covers whole data point
 * @param {WrapperType[]|*} wrappers
 * @return {boolean} true if there is only one wrapper and it covers whole data point, false if wrappers cover only its fragments
 */
function representsFullWrapper(wrappers) {
    if (wrappers.length != 1) {
        return false; //full wrapper
    }
    var wrapper = wrappers[0];
    return wrapper.levelId == 'raw' ? wrapper.start == wrapper.data.$t && wrapper.end == wrapper.data.$t : wrapper.start == wrapper.data.$s && wrapper.end == wrapper.data.$e;
}

function makeFullWrapper(dataPoint, levelId) {
    if (levelId == 'raw') {
        return {
            levelId,
            data: dataPoint,
            start: dataPoint.$t,
            end: dataPoint.$t
        }
    }
    else {
        return {
            levelId,
            data: dataPoint,
            start: dataPoint.$s,
            end: dataPoint.$e
        }
    }
}

class PointRegistry {


    constructor(registerId) {
        this.registerId = registerId;
        this._wrappers = [];
    }

    isEmpty() {
        return this._wrappers.length == 0;
    }

    /**
     * insert wrapper into registry of shared data point
     * @param wrappers
     * After
     * @return {DiffRangeSetResultType} diff information about inserting new range
     */
    insertWrappers(wrappers) {
        var diff = DiffRangeSet.add(this._wrappers, wrappers, null, null, null, null, (wrapper)=>({
            levelId: wrapper.levelId,
            data: wrapper.data
        }));
        this._wrappers = diff.result;
        return diff;
    }

    insertInitialWrappers(wrappers) {
        this._wrappers = wrappers;
    }

    removeWrappers(wrappers) {
        var diff = DiffRangeSet.subtract(this._wrappers, wrappers, null, null, null, null, (wrapper)=>({
            levelId: wrapper.levelId,
            data: wrapper.data
        }));
        this._wrappers = diff.result;
        return diff;
    }
}