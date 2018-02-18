const baseController = require('../controllers/baseController');

module.exports = (app) => {
    app.get('/', baseController.index);
    app.get('/random', baseController.random);
    app.get('/errors/404', baseController.fourZeroFour);
    app.get('/errors/gone-wrong', baseController.goneWrong);
    return app;
};
