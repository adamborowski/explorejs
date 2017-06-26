import BasicViewportModel from '../prediction/BasicViewportModel.js';
import WiderContextModel from '../prediction/WiderContextModel.js';

const factoryMap = {
    basic() {
        return new BasicViewportModel();
    },
    'wider-context'() {

        return new WiderContextModel();
    }
};

export default (type) => factoryMap[type]();

export const types = ['basic', 'wider-context'];
