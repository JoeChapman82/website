module.exports = {
    index: (req, res) => res.render('index'),
    random: (req, res) => res.render('random'),
    fourZeroFour: (req, res) => res.render('errors/404'),
    goneWrong: (req, res) => res.render('errors/gone-wrong'),
};
