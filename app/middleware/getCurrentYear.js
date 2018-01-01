module.exports = (req, res, next) => {
    res.locals.copyrightYear = new Date().getFullYear();
    next();
};
