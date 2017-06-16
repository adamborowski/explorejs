const dataReader = require('./data-reader');
const batchedInsert = require('./batch-postgres-insert');
const batchJob = require('./utils/batch-job');
const batcher = require('./utils/batcher');
const aggregator = require('./data-aggregator');

module.exports = (db, measurementId, levels, start, end, interval, batchSize) => {

    const generator = dataReader(start, end, interval);
    const rawBatchedUpload = batcher(batchSize, batchedInsert.raw(measurementId, db));
    const aggregationsBatchedUpload = levels.filter(a => a.id !== 'raw')
        .map(l => aggregator(l.id,
            l.step,
            batcher(batchSize,
                batchedInsert.aggregation(measurementId, l.id, db), l.id)));

    batchJob(generator, [rawBatchedUpload, ...aggregationsBatchedUpload]);

};
