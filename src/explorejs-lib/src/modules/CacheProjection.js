import * as OrderedSegmentArray from "explorejs-common/src/OrderedSegmentArray"
import * as MergeOperation from "explorejs-common/src/layered/MergeOperation";
/**
 * Cache projection
 * Calculates diffs in meaning of rendering effect (how user sees that)
 *
 * compile levels to call renderer.
 *
 * @property {SerieCache} SerieCache
 */
export default class CacheProjection {
    /**
     *
     * @param levelId id of projection level. For example if 1m is given, this will not consider any data from 30s, 10s and raw level)
     * @param levelIds
     * @return {CacheProjection}
     */
    setup(levelId, levelIds) {
        this.levelId = levelId;
        this.levelIds = levelIds;
        this.levelNumbers = {};
        for (var i = 0; i < levelIds.length; i++) {
            this.levelNumbers[levelIds[i]] = i;
        }
        /**
         * array of ranges {start, end, level} to indicate what projection shows at given range
         * @type {Array}
         */
        this.projection = [];
        return this;
    }

    /**
     * For given range and levelId, return >0 if this is front layer, 0 it target layer, <0 if back layer
     * @param range
     * @param levelId
     */
    levelComparator(range, levelId) {
        return this.levelNumbers[range.levelId] - this.levelNumbers[levelId];
    }


    /**
     * Update projection range indices by inserting ranges at specific level.
     * Fire proper events to be handled by DataStore
     * @param levelId
     * @param rangeSet
     */
    recompileProjection(levelId, rangeSet) {
        if (rangeSet.length == 0) {
            console.info("CacheProjection::recompileProjection(): got empty array, no recompile is needed.")
            return; // no recompile is needed
        }
        /**
         * @type {{before, overlap, after, start, end}|*}
         */
        var split = OrderedSegmentArray.splitRangeSetOverlapping(this.projection, rangeSet[0].start, rangeSet[rangeSet.length - 1].end);

        var layers = this._distributeRangesToLayers(split.overlap, levelId);

        var result = MergeOperation.execute(layers.B, layers.T, layers.F, rangeSet);

        return result;


        // perform MergeOperation
        // this.projection=join before+result+after
        // return diff info coming from the MergeOperation result

    }

    _distributeRangesToLayers(rangeSet, levelId) {
        if (!this.levelNumbers.hasOwnProperty(levelId)) {
            throw new RangeError(`Level of id ${levelId} is not supported.`);
        }

        var B = []; // projection ranges behind the layer
        var F = []; // projection ranges in front of the layer
        var T = []; // projection ragnes on the merging layer

        for (var range of rangeSet) {
            var cmp = this.levelComparator(range, levelId);
            if (cmp > 0) {
                B.push(range);
            }
            else if (cmp == 0) {
                T.push(range);
            }
            else {
                F.push(range);
            }
        }
        return {B, F, T};
    }


}