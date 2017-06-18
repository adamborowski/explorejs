const pgp = require('./utils/pgp');

/**
 * connects to the database and returns data API
 * @param url mongo db connection url
 * @returns {Promise.<{initDb: (function(): Promise), putData: (function(*): Promise)}>}
 */
async function connect(url) {
    const db = pgp(url);

    return {

        getConnection: () => db,

        async initDb(levels) {

            await db.query(`
            DROP TABLE if exists raw CASCADE;

            CREATE TABLE raw
            (
                measurement_id  integer NOT NULL,
                "$t"            timestamp without time zone NOT NULL,
                value           double precision,
                CONSTRAINT      raw_pkey PRIMARY KEY (measurement_id, "$t")
            );
            
            `);

            await db.query(`
            
            drop index if exists agg_search_a;
            drop index if exists agg_search_b;
            DROP TABLE if exists agg CASCADE;
            
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
            
            
            CREATE INDEX agg_search_a
            ON agg (measurement_id, l, "$s");
            
            
            CREATE INDEX agg_search_b
            ON agg (measurement_id, l, "$e");
            
            `);

            await db.query(`
            
            DROP TABLE if exists meta;
            DROP VIEW IF EXISTS manifest;
            
            CREATE TABLE meta
            (
                key character varying(32) COLLATE pg_catalog."default" NOT NULL,
                value text COLLATE pg_catalog."default" NOT NULL,
                CONSTRAINT meta_pkey PRIMARY KEY (key)
            );
            
            CREATE MATERIALIZED VIEW public.manifest AS
            select min("$t") as start, max("$t") as end, min(measurement_id) as measurement_id, min(meta."value")
             as manifest from raw, meta where key='levels' group by measurement_id;
            
            `);

            await db.query('insert into meta (key, value) values ($1, $2)', ['levels', JSON.stringify(levels)]);

        },

        close() {
            pgp.end();
        }
    };
}

module.exports = {connect};
