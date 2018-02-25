const ApiCaller = require('../../services/apiCaller/apiCaller');

module.exports = (req, res, next) => {
    const getUuid = new ApiCaller(process.env.UUID_GENERATOR_URI, 'GET');
    getUuid.call()
    .then((response) => {
        res.locals.uuidv4 = response.body;
        return next();
    })
    .catch((error) => {
        console.log(error);
        return next();
    });
};
