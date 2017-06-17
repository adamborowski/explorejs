const yargs = require('yargs');

yargs.option('u', {
    alias: 'url',
    'default': 'postgres://borovsky_explorejs:explorejs@adamborowski.pl:5432/borovsky_explorejs',
    describe: 'db connect url',
    type: 'string'
});

yargs.option('p', {
    alias: 'port',
    'default': '4000',
    describe: 'server port',
    type: 'number'
});

module.exports = yargs.argv;
