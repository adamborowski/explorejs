const MongoClient = require('mongodb');

/**
 * connects to the database and returns data API
 * @param url mongo db connection url
 * @returns {Promise.<{initDb: (function(): Promise), putData: (function(*): Promise)}>}
 */
async function connect(url) {
    const db = await MongoClient.connect(url);

    return {
        async initDb(levels) {
            db.data && await db.data.drop();
            const data = await db.createCollection('data', {});

            await data.createIndex({t: 1, l: 1});

            const meta = await db.createCollection('meta');

            await meta.replaceOne({_id: 'levels'}, {
                _id: 'levels',
                levels: levels
            });

        },

        async putData({data, aggregations}) {
            const dataCollection = db.collection('data');

            const insertMany = async (levelId, data) => {
                console.log(`Inserting ${data.length} items into level ${levelId}...`);
                await dataCollection.insertMany(data, {ordered: false});
                console.log(`Inserted ${data.length} items into level ${levelId}.`);
            };

            const rawPromise = insertMany('raw', data.map(point => ({l: 'raw', ...point})));
            const aggPromises = aggregations.map(({levelId, data}) => insertMany(levelId, data.map(point => ({l: levelId, ...point}))));

            await Promise.all([rawPromise, ...aggPromises]);

            console.log('Finished deployment of data.');
        },

        close() {
            db.close();
        }
    };
}

module.exports = {connect};
