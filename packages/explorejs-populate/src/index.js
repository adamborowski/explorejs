const argv = require('./argv');
const levels = require('./levels');
const {connect} = require('./data-deployer');
// const {getData} = require('./data-source');
const batchPopulator = require('./batch-populator');

async function init() {
    const db = await connect(argv.url);

    if (argv['init-db']) {
        await db.initDb(levels[argv.levels]);
    }

    batchPopulator(
        db.getConnection(),
        Number(argv['measurement-id']),
        levels[argv['levels']],
        new Date(argv['start']).getTime(),
        new Date(argv['end']).getTime(),
        Number(argv['interval']),
        Number(argv['batch-size'])
    );

    db.close();
}

init();