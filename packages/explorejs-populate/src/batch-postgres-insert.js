const pgp = require('./utils/pgp');
const dateFormat = require('dateformat');

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';

// Concatenates an array of objects or arrays of values, according to the template,
// to use with insert queries. Can be used either as a class type or as a function.
//
// template = formatting template string
// data = array of either objects or arrays of values
function Inserts(template, data) {
    if (!(this instanceof Inserts)) {
        return new Inserts(template, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return data.map(d => '(' + pgp.as.format(template, d) + ')').join();
    };
}

/**
 * Batch callback which inserts items to postgres
 */
module.exports = {
    raw: (measurementId, db) => async items => {
        console.log(`Inserting ${items.length} raw values`);
        await db.any('INSERT INTO raw VALUES $1', new Inserts('${m}, ${t}, ${v}', items.map(p => ({
            m: measurementId,
            t: dateFormat(p.$t, DATE_FORMAT),
            v: p.v
        }))));
        console.log('Done.');
    },

    aggregation: (measurementId, levelId, db) => async items => {
        console.log(`Inserting ${items.length} aggregated ${levelId} values`);

        await db.any('INSERT INTO agg VALUES $1', new Inserts('${m}, ${l}, ${s}, ${e}, ${a}, ${t}, ${b}, ${c}', items.map(p => ({
            m: measurementId,
            l: levelId,
            s: dateFormat(p.$s, DATE_FORMAT),
            e: dateFormat(p.$e, DATE_FORMAT),
            a: p.a,
            t: p.t,
            b: p.b,
            c: p.c
        }))));
        console.log('Done.');
    }
};
