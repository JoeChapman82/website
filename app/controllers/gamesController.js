const renderGames = require('./renders/renderGames');

module.exports = {
    index: [renderGames.index],
    classicsIndex: [renderGames.classicsIndex],
    classicsSnake: [renderGames.classicsSnake],
    actionIndex: [renderGames.actionIndex],
};
