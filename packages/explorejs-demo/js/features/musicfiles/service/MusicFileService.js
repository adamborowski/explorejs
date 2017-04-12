/**
 *  Defines the ClusterService
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
export default class MusicFileService {
    constructor($http, utils, $q) {
        this.$q = $q;
        this.utils = utils;
        this.$http = $http;
        this.getDemoList = function () {
            return $http.get(utils.getApi('/demolist'));
        };
        this.filesPromise = new $q((resolve, reject)=> {
            this.$http.get(this.utils.getApi('/files')).then((a)=> {
                a.data.forEach((x)=> {
                    x.known = localStorage.getItem("known/" + x.filePath) == "yes";
                    x.fileName = x.fileName.replace(/^([^\d]*?)\s*-\s*(.*)$/, "<strong>$1</strong> - $2")
                });
                resolve(this.Shuffle(a.data))
            });
        });
    }

    Shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    getFiles() {
        return this.filesPromise;
    }

    toggleKnowIt(musicFile) {
        musicFile.known = !musicFile.known;
        var key = "known/" + musicFile.filePath;
        if (musicFile.known) {
            localStorage.setItem(key, "yes");
        }
        else {
            localStorage.removeItem(key);
        }
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
