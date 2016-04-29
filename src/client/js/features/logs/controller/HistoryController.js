var labelTypes = {
    "ERROR": "danger",
    "WARN": "warning",
    "DEBUG": "default",
    "INFO": "info"
};

var numberPadding = 20;

export default class HistoryController {

    constructor($scope, LogClusterService) {
        this.$scope = $scope;
        this.LogClusterService = LogClusterService;
        this.maxBodyHeight = window.screen.height - 270;
    }

    getLabelType(log) {
        return labelTypes[log.Type];
    }

    init(entry) {
        this.entry = entry;
        this.current = this.entry.Id;
        this.loadData(this.current - numberPadding, this.current)
    }

    shouldShowLog(log, regex, sameThread){
        if(!sameThread&&regex==""){
            return true;
        }
        //controller.isThreadRegex(log.Thread, reg) || (reg=='' && (!sameThread||controller.currentLog.Thread==log.Thread))
        if(regex!=""&&log.Thread.match(regex)){
            return true;
        }
        if(sameThread && log.Thread==this.currentLog.Thread){
            return true;
        }
        return false;
    }

    loadPrev() {
        var newStart = this.start - numberPadding;
        var promise = this.LogClusterService.getLogs(newStart, this.start - 1);
        return promise.then(data=> {
            this.logs.unshift(...data.data)
            this.start = newStart;
        });
    }

    loadNext() {
        var newEnd = this.end + numberPadding;
        var promise = this.LogClusterService.getLogs(this.end + 1, newEnd);
        return promise.then(data=> {
            this.logs.push(...data.data)
            this.end = newEnd;
        });
    }

    loadData(start, end) {
        var promise = this.LogClusterService.getLogs(start, end);
        return promise.then(data=> {
            this.logs = data.data;
            this.currentLog = this.logs.filter(a=>a.Id == this.current)[0];
            this.start = start;
            this.end = end;
        });
    }

    toggle() {
        this.$scope.opened = !this.$scope.opened;
    }

    close() {
        console.log('close')
        this.$scope.opened = false;
    }
}
