const renderBase = require('./renders/renderBase');
const selectRandomCanvas = require('../middleware/selectRandomCanvas');

module.exports = {
    index: [renderBase.index],
    random: [selectRandomCanvas, renderBase.random],
    siteMap: [renderBase.siteMap],
    cookiePolicy: [renderBase.cookiePolicy],
    privacyStatement: [renderBase.privacyStatement],
};
