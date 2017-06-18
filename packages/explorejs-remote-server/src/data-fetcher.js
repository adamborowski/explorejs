const pgp = require('./pgp');
const dateFormat = require('dateformat');

const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss';
/**
 * connects to the database and returns data API
 * @param url mongo db connection url
 * @returns {Promise.<{initDb: (function(): Promise), putData: (function(*): Promise)}>}
 */

function connect(url) {
    const db = pgp(url);

    return {

        getConnection: () => db,

        async getManifest() {

            const series = await db.any('select * from manifest');

            return {
                series: series.map(s => ({
                    start: s.start.getTime(),
                    end: s.end.getTime(),
                    serieId: s.measurement_id.toString(),
                    levels: JSON.parse(s.manifest).filter(l => l.id !== 'raw')
                }))
            };
        },

        getData(requests) {
            return Promise.all(requests.map(async r => {
                const from = dateFormat(new Date(r.from), DATE_FORMAT);
                const to = dateFormat(new Date(r.to), DATE_FORMAT);


                const data = await(r.level === 'raw' ?
                        db.any('select "$t", value as v from raw where measurement_id=$1 and "$t" >= $2 and "$t" <= $3 order by "$t" asc ', [r.id, from, to])
                        :
                        db.any('select "$s", "$e", a, t, b, c from agg where measurement_id=$1 and l =  $2 and (("$s" >$3 and "$s"<$4) or ("$e" >$3 and "$e"<$4)) order by "$s" asc', [r.id, r.level, from, to])
                );

                if (r.level === 'raw') {
                    for (const d of data) {
                        d.$t = d.$t.getTime();
                    }
                } else {
                    for (const d of data) {
                        d.$s = d.$s.getTime();
                        d.$e = d.$e.getTime();
                    }
                }

                return {...r, data};
            }));
        },

        close() {
            pgp.end();
        }
    };
}

module.exports = {connect};
