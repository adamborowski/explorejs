import {OrderedSegmentArray} from 'explorejs-common';
import {MergeOperation} from 'explorejs-common';
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
        for (let i = 0; i < levelIds.length; i++) {
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
     * ??Fire proper events to be handled by DataStore
     * As a side effect, projection array is changed
     * @param levelId
     * @param rangeSet
     * @return {*} difference: added, removed, resized (all ranges contain levelId)
     */
    recompile(levelId, rangeSet) {
        if (rangeSet.length === 0) {
            console.log('CacheProjection::recompileProjection(): got empty array, no recompile is needed.');
            return null; // no recompile is needed
        }
        if (!this.levelNumbers.hasOwnProperty(levelId)) {
            throw new RangeError(`Level of id ${levelId} is not supported.`);
        }
        if (this.levelNumbers[levelId] < this.levelNumbers[this.levelId]) {
            throw new RangeError('CacheProjecton::recomplieProjection: level outside projection'); // no recompile is needed
        }
        const mapFn = a => ({
            start: a.start,
            end: a.end,
            levelId: levelId
        });

        rangeSet = rangeSet.map(mapFn);
        /**
         * @type {{before, overlap, after, start, end}|*}
         */
        const split = OrderedSegmentArray.splitRangeSetOverlapping(this.projection, rangeSet[0].start, rangeSet[rangeSet.length - 1].end);

        const layers = this._distributeRangesToLayers(split.overlap, levelId);

        const operation = MergeOperation.execute(layers.B, layers.T, layers.F, rangeSet, (r) => ({levelId: r.levelId}));

        const overlappedResult = [].concat(operation.B.result, layers.F, operation.T.result).sort(this._sortFn).map(a => ({
            start: a.start,
            end: a.end,
            levelId: a.levelId
        }));

        this.projection = [].concat(split.before, overlappedResult, split.after);

        const added = [].concat(operation.T.added, operation.B.added).sort(this._sortFn);
        const resized = [].concat(operation.T.resized, operation.B.resized).sort(this._sortFn);
        const removed = [].concat(operation.T.removed, operation.B.removed).sort(this._sortFn);

        return {
            added, removed, resized
        };
    }

    _sortFn(a, b) {
        return a.start - b.start;
    }

    _distributeRangesToLayers(rangeSet, levelId) {
        if (!this.levelNumbers.hasOwnProperty(levelId)) {
            throw new RangeError(`Level of id ${levelId} is not supported.`);
        }

        const B = []; // projection ranges behind the layer
        const F = []; // projection ranges in front of the layer
        const T = []; // projection ragnes on the merging layer

        for (let range of rangeSet) {
            const cmp = this.levelComparator(range, levelId);

            if (cmp > 0) {
                B.push(range);
            } else if (cmp === 0) {
                T.push(range);
            } else {
                F.push(range);
            }
        }
        return {B, F, T};
    }

}
