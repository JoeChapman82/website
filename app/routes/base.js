const baseController = require('../controllers/baseController');

module.exports = (app) => {
    app.get('/', baseController.index);
    return app;
};
