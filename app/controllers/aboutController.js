const renderAbout = require('./renders/renderAbout');
const generatePdf = require('../middleware/generatePdf');

module.exports = {
    index: [renderAbout.index],
    site: [renderAbout.site],
    me: [renderAbout.me],
    cv: [renderAbout.cv],
    postCv: [generatePdf],
    siteMap: [renderAbout.siteMap],
    cookiePolicy: [renderAbout.cookiePolicy],
    privacyStatement: [renderAbout.privacyStatement],
};
