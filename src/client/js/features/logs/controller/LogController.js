export default class LogController {
    constructor(LogClusterService) {
        this.logTypes = [];
        LogClusterService.getLogClusters().then(data=> {
            this.logTypes = data.data;
            for (var i of this.logTypes) {
                i.Count = i.reduce((red, a)=>red + a.NumTotalEntries, 0);
            }
        });
    }
}
