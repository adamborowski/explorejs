const Generator = require('../../explorejs-server/app/data/Generator');
const Aggregator = require('../../explorejs-server/app/data/Aggregator');

/**
 * Reads data from source file and calculates aggregations
 * @param levels {{id, step}[]}
 * @param start {Date}
 * @param end {Date}
 * @param interval {number} interval of generated data
 * @returns {{data: *, aggregations}}
 */
function getData(levels, start, end, interval = 10000) {

    const generator = new Generator();
    const data = generator.getData(start, end, interval);
    const aggregators = levels.filter(a => a.id !== 'raw').map(level => new Aggregator(level.id, level.step));

    for (const point of data) {
        for (const aggregator of aggregators) {
            aggregator.Consume(point.t, point.v);
        }
    }

    const aggregations = aggregators.map(a => ({levelId: a.levelId, data: a.Finish()}));

    return {data, aggregations};
}

module.exports = {getData};
