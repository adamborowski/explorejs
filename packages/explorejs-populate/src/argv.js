const yargs = require('yargs');

yargs.option('s', {
    alias: 'start',
    'default': '2017-01-01',
    describe: 'start date of data to generate',
    type: 'string'
});

yargs.option('e', {
    alias: 'end',
    'default': '2017-02-30',
    describe: 'end date of data to generate',
    type: 'string'
});

yargs.option('u', {
    alias: 'url',
    'default': 'postgres://borovsky_explorejs:explorejs@adamborowski.pl:5432/borovsky_explorejs',
    describe: 'db connect url',
    type: 'string'
});

yargs.option('l', {
    alias: 'levels',
    'default': 'default',
    describe: 'id of levels definition, specified in levels.js file',
    type: 'string'
});

yargs.option('i', {
    alias: 'init-db',
    'default': 'true',
    describe: 'if true, database will be initialized (data purged, metadata recreated)',
    type: 'boolean'
});

yargs.option('m', {
    alias: 'measurement_id',
    'default': '0',
    describe: 'id of measurement',
    type: 'number'
});

yargs.option('k', {
    alias: 'skip',
    'default': '0',
    describe: 'number of points ignored at the beginning data generation',
    type: 'number'
});

module.exports = yargs.argv;