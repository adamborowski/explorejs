import moment from 'moment';

const format = 'YYYY-MM-DD hh:mm';

export const formatDate = date => moment(date).format(format);
