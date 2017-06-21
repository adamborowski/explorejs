# Explore.js

Full-featured aggregated time series data connector for JavaScript charting libraries.

This library makes every charting library able to visualize any amount of data.
It handles communication with server to get proper chunk of data in proper time.

Features:
---------
* loads as few data to the browser as is it required to show good visualization
* automatically picks best aggregation to show to the user
* supports any aggregation (for example raw data every 10s, then min(x), max(x), avg(x) for 30s, 1m, 10m, 30m, 1h, 8h, 12h, 1d, 7d, 30d, 90d, 1y)
* optimized communication with server
* prefetching data to prevent user from waiting
* data cache (every aggregation stored separately)
* visual fallback to higher aggregation if wanted data is not yet loaded (you will see lowe resolution for for a while)
* easy integration with any charting library (see explorejs-adapters package)
* React bindings

Use case
-----
* you have 150.000.000 points in your database (50 years of data every 10s)
* you have adequate aggregations (as in the example above)
* you implement simple, but required, REST endpoint on the server
* you have your charting library (flot, dygraphs, highcharts, jqplot, plotly, visjs, dygraphs, etc...)
* you use *explore.js* to enable unbounded exploration of given time series
* your chart displays few (ie 1000 points) at a time, explore.js just tells you what to display
* your browser loads chunks at appriopriate levels

Working demo
---------
_(use mouse wheel and shift key to zoom/pan)_

_works best in Chrome_

http://explorejs.adamborowski.pl/scenario/0/session/0

Video demonstration (older)
---------
* https://www.youtube.com/watch?v=l993l48-Njw
* https://www.youtube.com/watch?v=b_VRyhak5Xg


How to use it
-------------
First, look at explorejs-tester React application.
This library is under active development, so there is no official tutorial yet.

Questions?
----------
Contact me on twitter https://twitter.com/fl_borovsky or fl.borovsky(at)gmail 
