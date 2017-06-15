const pgp = require('pg-promise')({});

/**
 * connects to the database and returns data API
 * @param url mongo db connection url
 * @returns {Promise.<{initDb: (function(): Promise), putData: (function(*): Promise)}>}
 */
async function connect(url) {
    const db = pgp(url);

    return {
        async initDb(levels) {

            await db.query(`
            DROP TABLE if exists raw;

            CREATE TABLE raw
            (
                measurement_id  integer NOT NULL,
                "$t"            timestamp without time zone NOT NULL,
                value           double precision,
                CONSTRAINT      raw_pkey PRIMARY KEY (measurement_id, "$t")
            );
            
            `);

            await db.query(`
            
            DROP TABLE if exists agg;
            
            CREATE TABLE agg
            (
                measurement_id integer NOT NULL,
                l character varying(6) NOT NULL,
                "$s" timestamp without time zone NOT NULL,
                "$e" timestamp without time zone NOT NULL,
                a double precision,
                t double precision,
                b double precision,
                c integer,
                PRIMARY KEY (measurement_id, l, "$s")
            );
            
            `);

            await db.query(`
            
            DROP TABLE if exists meta;
            
            CREATE TABLE meta
            (
                key character varying(32) COLLATE pg_catalog."default" NOT NULL,
                value text COLLATE pg_catalog."default" NOT NULL,
                CONSTRAINT meta_pkey PRIMARY KEY (key)
            );
            
            `);

            await db.query('insert into meta (key, value) values ($1, $2)', ['levels', JSON.stringify(levels)]);

        },

        async putData({measurementId, data, aggregations}) {

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

            const _ = require('lodash');

            console.log('unique points: ' + data.length + '===' + _.uniq(data, a => new Date(a).toISOString()).length);

            const result = await db.any('INSERT INTO raw VALUES $1', new Inserts('${m}, ${t}, ${v}', data.map(p => ({
                m: measurementId,
                t: new Date(p.$t).toISOString(),
                v: p.v
            }))));

            const insertMany = async (levelId, data) => {
                console.log(`Inserting ${data.length} items into level ${levelId}...`);
                const result = await db.any('INSERT INTO agg VALUES $1', new Inserts('${m}, ${l}, ${s}, ${e}, ${a}, ${t}, ${b}, ${c}', data.map(p => ({
                    m: measurementId,
                    l: levelId,
                    s: new Date(p.$s).toISOString(),
                    e: new Date(p.$e).toISOString(),
                    a: p.a,
                    t: p.t,
                    b: p.b,
                    c: p.c
                }))));

                console.log(`Inserted ${data.length} items into level ${levelId}.`);
            };

            for (const {levelId, data} of aggregations) {
                await insertMany(levelId, data);
            }

            console.log('Finished deployment of data.');
        },

        close() {
            pgp.end();
        }
    };
}

module.exports = {connect};
