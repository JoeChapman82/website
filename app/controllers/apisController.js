const renderApis = require('./renders/renderApis');
const getUuid = require('../middleware/apiCalls/uuidGenerator');

module.exports = {
    index: [renderApis.index],
    uuidGenerator: [getUuid, renderApis.uuidGenerator]
};
