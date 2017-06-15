const argv = require('./argv');
const levels = require('./levels');
const {connect} = require('./data-deployer');
const {getData} = require('./data-source');

async function init() {
    const db = await connect(argv.url);

    if (argv['init-db']) {
        await db.initDb(levels[argv.levels]);
    }

    const generatedData = getData(levels[argv.levels], new Date(argv.start), new Date(argv.end), 10000, argv.skip);

    await db.putData({...generatedData, measurementId: Number(argv['measurement_id'])});
    db.close();
}

init();
