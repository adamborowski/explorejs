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
    dygraphs(dataSource, dom) {
        return new DygraphsAdapter(dataSource, dom, Dygraph);
    },
    visjs(dataSource, dom) {
        return new VisJsAdapter(dataSource, dom, vis); // todo visjs adapter should create everthing needed
    },
    flot(dataSource, dom) {
        window.jQuery = $; // hack for flot
        const Flot = require('Flot');

        require('Flot/jquery.flot.time');
        require('Flot/jquery.flot.selection');
        require('Flot/jquery.flot.fillbetween');

        return new FlotAdapter(dataSource, dom, Flot, $);
    },
    highcharts(dataSource, dom) {
        const HighCharts = require('highcharts');
        const HighChartsMore = require('highcharts/highcharts-more');

        HighChartsMore(HighCharts);
        return new HighChartsAdapter(dataSource, dom, HighCharts);
    },
    jqplot(dataSource, dom) {
        window.jQuery = $; // hack for flot
        require('as-jqplot/dist/jquery.jqplot.js');
        require('as-jqplot/dist/plugins/jqplot.dateAxisRenderer');
        require('as-jqplot/dist/plugins/jqplot.cursor');
        return new JqPlotAdapter(dataSource, dom, $);
    },
    plotly(dataSource, dom) {
        return new PlotlyAdapter(dataSource, dom, Plotly);
    }
};

export default (type, dataSource, dom) => factoryMap[type](dataSource, dom);

export const types = ['dygraphs', 'visjs', 'flot', 'highcharts', 'jqplot', 'plotly'];
