const requireDir = require('require-dir');
const gamesContent = requireDir('../../content/tutorials/games', {recurse: true});

module.exports = {
    index: (req, res) => res.render('tutorials/index'),
    canvasIndex: (req, res) => res.render('tutorials/canvas/index'),
    gamesIndex: (req, res) => res.render('tutorials/games/index'),
    gamesFpsCounter: (req, res) => res.render('tutorials/games/display-fps-counter', {content: gamesContent['display-fps-counter']})
};
