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

        close() {
            pgp.end();
        }
    };
}

module.exports = {connect};
