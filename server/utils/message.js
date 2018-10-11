const moment = require('moment');// library time stamp
const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};
const generateLocationMessage = (from, latitude, longitude)=> {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
};