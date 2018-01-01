module.exports = {
    index: (req, res) => res.render('games/index'),
    classicsIndex: (req, res) => res.render('games/classics/index'),
    classicsSnake: (req, res) => res.render('games/classics/snake'),
    classicsPong: (req, res) => res.render('games/classics/pong'),
    actionIndex: (req, res) => res.render('games/action/index'),
    adventureIndex: (req, res) => res.render('games/adventure/index'),
    arcadeIndex: (req, res) => res.render('games/arcade/index')
};
