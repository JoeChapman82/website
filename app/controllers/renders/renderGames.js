module.exports = {
    index: (req, res) => res.render('games/index'),
    classicsIndex: (req, res) => res.render('games/classics/index'),
    classicsSnake: (req, res) => res.render('games/classics/snake'),
    actionIndex: (req, res) => res.render('games/action/index'),
};
