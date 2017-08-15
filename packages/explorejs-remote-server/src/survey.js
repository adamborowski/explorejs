const pgp = require('./pgp');
const dateFormat = require('dateformat');

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';

/**
 * connects to the database and returns data API
 * @param url mongo db connection url
 * @returns {Promise.<{initDb: (function(): Promise), putData: (function(*): Promise)}>}
 */

function connect(db) {

    return {

        getConnection: () => db,

        async getResponses() {

            const series = await db.any(`select id, name, time, testing, data from surveys`);

            return series;
        },

        async addResponse(name, time, data, isTesting) {

            await db.none('insert into surveys (name, time, data, testing) values ($1,  to_timestamp($2 / 1000), $3, $4)', [name, time, data, isTesting]);
        }

    };
}

module.exports = {connect};
