/**
 * Flot plugin for adding additional auto scalling modes.
 *
 * @author Joel Oughton
 */
export default class AutoScale {
    constructor($) {
        function init(plot) {
            var setupGrid = plot.setupGrid;
            plot.setupGrid = ()=> {
                plot.autoScale();
                var r = setupGrid.apply(plot, arguments);
                plot.getPlaceholder().trigger('plot_setupGrid')
                return r;
            };
            plot.autoScale = function () {
                var opts = plot.getYAxes()[0].options;
                var data = plot.getData();

                var xaxis = plot.getAxes().xaxis;
                const maxRed = (acc, val)=>Math.max(acc, val[1]);
                const minRed = (acc, val)=>Math.min(acc, val[1]);
                if (data.length == 3) {
                    const boundFilter = data=>data[1] != null && !isNaN(data[1]) && data[0] >= xaxis.options.min && data[0] <= xaxis.options.max;
                    var max = data[0].data.filter(boundFilter).reduce(maxRed, Number.NEGATIVE_INFINITY);
                    var min = data[1].data.filter(boundFilter).reduce(minRed, Number.POSITIVE_INFINITY);

                    var margin = Math.abs(max - min) * opts.autoscaleMargin;

                    opts.min = min - margin;
                    opts.max = max + margin;
                }


                // plot.setupGrid();
                // plot.draw();

                return {
                    min: opts.min,
                    max: opts.max
                };
            }
        }

        $.plot.plugins.push({
            init: init,
            name: "autoscalemode",
            version: "0.6"
        });
    }
}