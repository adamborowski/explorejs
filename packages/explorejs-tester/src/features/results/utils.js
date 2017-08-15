import moment from 'moment';

const format = 'YYYY-MM-DD HH:mm';

export const formatDate = date => moment(date).format(format);
