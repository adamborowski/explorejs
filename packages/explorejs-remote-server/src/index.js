const argv = require('./argv');
const {connect} = require('./data-fetcher');
const Server = require('./server');

const fetcher = connect(argv.url);

(async function start() {
    const manifest = await fetcher.getManifest();

    const data = await fetcher.getData([
        {serieId: 0, level: 'raw', from: '2003-12-12 10:00', to: '2003-12-12 10:02'},
        {serieId: 0, level: '1y', from: '2003-12-12 10:00', to: '2013-12-12 10:02'}

    ]);

    const server = Server(Number(argv.port), fetcher);
})();

