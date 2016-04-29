module.exports = class Api {

    constructor(app) {
        this.app = app;
    }

    putResource(name, callback) {
        this.app.get('/api/' + name, (req, res)=> {
            res.set('Content-Type', 'application/json');
            res.send(callback.call(this, req));
        });
    }

    /**
     *
     * @param name
     * @param callback
     * @param contentType?
     */
    putResourceAsync(method, name, callback, contentType) {
        if (contentType == null) {
            contentType = 'application/json'
        }
        this.app[method]('/api/' + name, (req, res)=> {
            res.set('Content-Type', contentType);
            callback.call(this, req, res);
        });
    }

    load() {
        //this.putResource('files', this.getFiles.bind(this));
        //this.putResourceAsync('jira', this.getFilesAsync.bind(this));
    }

    //getFilesAsync(request, response) {
    //    setTimeout(()=> {
    //        response.send({result: 234});
    //    }, 1000)
    //
    //}


};