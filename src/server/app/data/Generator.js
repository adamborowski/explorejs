var DateUtil = require('../utils/DateUtil')
module.exports = class Generator {

    fun(x) {
        // return Math.sin(x) * (Math.sqrt(x) / Math.tan(x));
        return 50+Math.pow((Math.log(x)/40000000000),3)*Math.sin(x/1000)+Math.sin(2*x/10000)+Math.sin(Math.sqrt(x/100))
    }

    getData(from, to, interval) {
        from = from.getTime();
        to = to.getTime();
        var data = [];
        for (var i = from; i < to; i += interval) {
            data.push({$t: i, $tt: DateUtil.format(i), v: this.fun(i)});
        }
        return data;
    }
};