import {DygraphsAdapter, VisJsAdapter, PlotlyAdapter} from 'explorejs-adapters';
import Dygraph from 'dygraphs';
const Plotly = require('plotly.js/dist/plotly');
const factoryMap = {
    dygraphs(serieCache, dom) {
        return new DygraphsAdapter(serieCache, dom, Dygraph);
    },
    visjs(sereCache, dom) {
        const dataset = 1;
        const groups = 1;

        return new VisJsAdapter(sereCache, dom, dataset, groups); // todo visjs adapter should create everthing needed
    },
    flot(serieCace, dom) {

    },
    highcharts(serieCace, dom) {

    },
    jqplot(serieCace, dom) {

    },
    plotly(serieCace, dom) {
        return new PlotlyAdapter(serieCace, dom, Plotly);
    }
};

export default (type, serieCache, dom) => factoryMap[type](serieCache, dom);

export const types = ['dygraphs', 'visjs', 'flot', 'highcharts', 'jqplot', 'plotly'];
