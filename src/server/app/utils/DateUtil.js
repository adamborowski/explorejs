var moment = require('moment');
module.exports = class DateUtil {
    static fromString(str) {
        if (Number(str) < 0) {
            str = 0;
        }
        return moment(str);
    }

    static fromStringMillis(str) {
        return this.fromString(str).toDate().getTime();
    }

    static fromStringDate(str) {
        return this.fromString(str).toDate();
    }

    static format(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
};