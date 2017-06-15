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
    'default': 'mongodb://explorejs:explorejs@ds137540.mlab.com:37540/heroku_dfhk0tqr',
    describe: 'mongo db connect url',
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

module.exports = yargs.argv;