const renderBase = require('./renders/renderBase');
const selectRandomCanvas = require('../middleware/selectRandomCanvas');

module.exports = {
    index: [renderBase.index],
    random: [selectRandomCanvas, renderBase.random],
    fourZeroFour: [renderBase.fourZeroFour],
    goneWrong: [renderBase.goneWrong]
};
