const apisController = require('../controllers/apisController');

module.exports = (apis) => {
    apis.get('/', apisController.index);
    apis.get('/uuid-generator', apisController.uuidGenerator);
    return apis;
};
