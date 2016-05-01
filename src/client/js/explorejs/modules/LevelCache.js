/**
 * @property {SerieCache} SerieCache
 */
export default class LevelCache {
    constructor(level) {
        this.level = level;
    }

    setup() {

    }

    putData(data) {
        // todo merge range into array
        // todo fire range-scoped events
        console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id} = ${data.length}`);
    }
}