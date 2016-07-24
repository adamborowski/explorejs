const CONVERT_BASE = 36;
const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
import moment from "moment";
export default class WrapperIdFactory {
    static optimized(wrapper) {
        return `${wrapper.start.toString(CONVERT_BASE)}:${wrapper.end.toString(CONVERT_BASE)}:${wrapper.levelId}`
    }

    static debug(wrapper) {
        return `${wrapper.levelId} [${moment(wrapper.start).format(FORMAT)}] [${moment(wrapper.end).format(FORMAT)}]`
    }
}