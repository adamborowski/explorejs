const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const history = require('connect-history-api-fallback');

module.exports = (port, fetcher) => {
    const app = express();

    app.use(compression());
    app.use(bodyParser.json());
    app.use(history({ verbose: true}));
    app.use(express.static('node_modules/explorejs-tester/dist/'));

    app.get('/api/manifest', async (req, res) => {
        const manifest = await fetcher.getManifest()

        res.send(manifest);
    });

    app.post('/api/batch', async (req, res) => {
        const data = await fetcher.getData(req.body.series)

        res.send({series: data, errors: []}); // todo getData - errors
    });

    app.listen(port, function () {
        console.log(`Server running on port ${port}...`);
    });
};