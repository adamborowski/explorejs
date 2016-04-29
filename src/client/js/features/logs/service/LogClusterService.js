/**
 *  Defines the ClusterService
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
export default class LogClusterService {
    constructor($http, utils, $q) {
        this.$q = $q;
        this.utils = utils;
        this.$http = $http;
        this.getDemoList = function () {
            return $http.get(utils.getApi('/demolist'));
        };
    }

    getLogClusters() {
        return this.$http.get(this.utils.getApi('/clusters'));
    }

    getLogs(from, to) {
        return this.$http.get(this.utils.getApi(`/logs?from=${from}&to=${to}`));
    }

    jira(entry){
        //https://<JIRA_HOST>/rest/api/2/issue/
        return this.$q((resolve, reject)=> {
            this.$http.get(this.utils.getApi("/jira?id=" + entry.UniqueLogEntries[0].Entries[0].Id)).then(a=> {
                a.data.link = "http://localhost:2990/jira/browse/" + a.data.key;
                resolve(a.data);
            })
        });

    }
};
