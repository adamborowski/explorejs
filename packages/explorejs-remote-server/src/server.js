const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const history = require('connect-history-api-fallback');

module.exports = (port, fetcher, survey) => {
    const app = express();

    app.use(compression());
    app.use(bodyParser.json());


    app.get('/api/manifest', async (req, res) => {
        const manifest = await fetcher.getManifest()

        res.send(manifest);
    });

    app.post('/api/batch', async (req, res) => {
        const data = await fetcher.getData(req.body.series)

        res.send({series: data, errors: []}); // todo getData - errors
    });

    app.get('/api/surveys', async (req, res) => {
            try {
                const data = await survey.getResponses();

                res.send(data);
            }
            catch (e) {
                res.status(500).send(e.message);
            }
        }
    );

    app.post('/api/surveys', async (req, res) => {

        try {
            if (req.body.answers === undefined) {
                res.sendStatus(400).send({error: 'request body should contain answers array'})
                return;
            }

            const name = req.body.answers[11];
            const time = req.body.time;
            const data = req.body;


            await survey.addResponse(name, time, data, req.query.isTesting || true);
            res.send({success: true});
        }
        catch (e) {
            res.status(500).send(e.message);
        }


    });

    app.listen(port, function () {
        console.log(`Server running on port ${port}...`);
    });

    app.use(history({verbose: true}));
    app.use(express.static('node_modules/explorejs-tester/dist/'));
};