const baseController = require('../controllers/baseController');

module.exports = (app) => {
    app.get('/', baseController.index);
    app.get('/random', baseController.random);
    return app;
};
