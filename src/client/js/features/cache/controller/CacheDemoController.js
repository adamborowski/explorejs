import RequestManager from '../../../explorejs/modules/RequestManager';
import DataRequest from '../../../explorejs/data/DataRequest';
export default class CacheDemoController {
    constructor() {
        console.log('I am cache demo controller!!');
        var rm = new RequestManager();
        rm.addRequest(new DataRequest('s001', '1m', '2015-11-12', '2015-12-12', 0));

    }
}