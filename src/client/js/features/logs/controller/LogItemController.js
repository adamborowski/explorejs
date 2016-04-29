var labelTypes = {
    "ERROR": "danger",
    "WARN": "warning",
    "DEBUG": "default",
    "INFO": "info"
};

export default class LogItemController {

    constructor($scope, LogClusterService) {
        this.entry = $scope.log;
        this.opened = false;//this.entry.UniqueLogEntries.length == 1;
        this.ignored = false;
        this.LogClusterService = LogClusterService;
    }

    toggleIgnored() {
        this.ignored = !this.ignored;
    }

    jira() {
        var entry = this.entry;

        this.LogClusterService.jira(this.entry).then(a=> {
            this.issueCreated = a;
        });

    }

    toggle() {
        this.opened = !this.opened;
    }

    get Type() {
        return this.entry.Type;
    }

    get LabelType() {
        return labelTypes[this.Type];
    }

    get LastMessage() {
        return this.entry.LastMessage;
    }

    get NumTotalEntries() {
        return this.entry.NumTotalEntries;
    }

    get NumCauses(){
        return this.entry.LastCauses.length;
    }

    get Causes(){
        return this.entry.Causes;
    }

    get UniqueLogEntries() {
        return this.entry.UniqueLogEntries;
    }
}
