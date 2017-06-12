import {
    DygraphsAdapter, VisJsAdapter, PlotlyAdapter, FlotAdapter, JqPlotAdapter,
    HighChartsAdapter
} from 'explorejs-adapters';
import Dygraph from 'dygraphs';
import $ from 'jquery';
import vis from 'vis/dist/vis.js';
import 'vis/dist/vis.css';
const Plotly = require('plotly.js/dist/plotly');

const factoryMap = {
    dygraphs(serieCache, dom) {
        return new DygraphsAdapter(serieCache, dom, Dygraph);
    },
    visjs(serieCache, dom) {
        return new VisJsAdapter(serieCache, dom, vis); // todo visjs adapter should create everthing needed
    },
    flot(serieCache, dom) {
        window.jQuery = $; // hack for flot
        const Flot = require('Flot');

        require('Flot/jquery.flot.time');
        require('Flot/jquery.flot.fillbetween');

        return new FlotAdapter(serieCache, dom, Flot, $);
    },
    highcharts(serieCache, dom) {
        const HighCharts = require('highcharts');
        const HighChartsMore = require('highcharts/highcharts-more');

        HighChartsMore(HighCharts);
        return new HighChartsAdapter(serieCache, dom, HighCharts);
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
