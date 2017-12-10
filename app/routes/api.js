const apisController = require('../controllers/apisController');

module.exports = (apis) => {
    apis.get('/', apisController.index);
    return apis;
};
