var labelTypes = {
    "ERROR": "danger",
    "WARN": "warning",
    "DEBUG": "default",
    "INFO": "info"
};

export default class UniqueLogEntryController {

    constructor($scope) {
        this.$scope=$scope;
        this.entry = $scope.entry;
        this.opened = $scope.openOnStart;
        $scope.modalOpened = false;
    }

    toggle() {
        this.opened = !this.opened;
    }

    navigate(entry) {
        this.selectedItem = entry;
        this.$scope.modalOpened = true;

    }

}
