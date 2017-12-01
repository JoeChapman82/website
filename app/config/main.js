const twentyFourHoursInMinutes = 3600 * 24;
const oneMonthInMilliseconds = 3600000 * 24 * 31;

module.exports = {
    cookieLifespan: oneMonthInMilliseconds,
    csrfLifespan: twentyFourHoursInMinutes
};
