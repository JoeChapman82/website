const renderGames = require('./renders/renderGames');

module.exports = {
    index: [renderGames.index],
    classicsIndex: [renderGames.classicsIndex],
    classicsSnake: [renderGames.classicsSnake],
    classicsPong: [renderGames.classicsPong],
    actionIndex: [renderGames.actionIndex],
    adventureIndex: [renderGames.adventureIndex],
    arcadeIndex: [renderGames.arcadeIndex]

};
