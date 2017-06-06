import {DygraphsAdapter, VisJsAdapter, PlotlyAdapter, FlotAdapter, JqPlotAdapter} from 'explorejs-adapters';
import Dygraph from 'dygraphs';
import $ from 'jquery';
const Plotly = require('plotly.js/dist/plotly');

const factoryMap = {
    dygraphs(serieCache, dom) {
        return new DygraphsAdapter(serieCache, dom, Dygraph);
    },
    visjs(serieCache, dom) {
        const dataset = 1;
        const groups = 1;

        return new VisJsAdapter(serieCache, dom, dataset, groups); // todo visjs adapter should create everthing needed
    },
    flot(serieCache, dom) {
        window.jQuery = $; // hack for flot
        const Flot = require('Flot');

        require('Flot/jquery.flot.time');
        require('Flot/jquery.flot.fillbetween');

        return new FlotAdapter(serieCache, dom, Flot, $);
    },
    highcharts(serieCace, dom) {

    },
    jqplot(serieCace, dom) {
        window.jQuery = $; // hack for flot
        require('as-jqplot/dist/jquery.jqplot.js');
        require('as-jqplot/dist/plugins/jqplot.dateAxisRenderer');
        require('as-jqplot/dist/plugins/jqplot.cursor');
        return new JqPlotAdapter(serieCace, dom, $);
    },
    plotly(serieCace, dom) {
        return new PlotlyAdapter(serieCace, dom, Plotly);
    }
};

export default (type, serieCache, dom) => factoryMap[type](serieCache, dom);

export const types = ['dygraphs', 'visjs', 'flot', 'highcharts', 'jqplot', 'plotly'];
