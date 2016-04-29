module.exports = require('optimist')
//path where to find files
    .alias('path', 'p')
    .default('path', '.')

    //port to bind the server
    .alias('port', 'r')
    .default('port', 3000)

    //use webpack dev proxy or compiled release of angular app
    .alias('webpack-dev-server', 'd')
    .default('webpack-dev-server', false)

    //webpack dev port
    .default('webpack-dev-port', '8080')


    .alias('types', 't')
    .alias('start', 's')
    .alias('end', 'e')
    .alias('file', 'f')
    .alias('output','o')
    .alias('threshold', 'l')

    .default('file', null)
    .default('types', 'WARN|ERROR')
    .default('start', '0')
    .default('end', true)
    .default('threshold', 0.3)
    .default('output', 'cli')//html

    .argv;