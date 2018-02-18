module.exports = (err, req, res, next) => { // error handler - prevents any unwanted returns of stacktraces on non dev environments
    if(process.env.NODE_ENV !== 'production') {
        res.status(500).send(`Got an error:<br \>
            ${err}<br \>
            Stacktrace:<br \>
            ${err.stack}`);
    } else {
        res.redirect('/errors/gone-wrong');
    }
};
