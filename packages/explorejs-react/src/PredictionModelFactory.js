import {BasicViewportModel, WiderContextModel} from 'explorejs-lib';
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
