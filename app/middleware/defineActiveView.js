module.exports = (req, res, next) => {
    let urlParts = req.originalUrl.split('/');
    res.locals.activeView = urlParts[1] || 'home';
    next();
};
