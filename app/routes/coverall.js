module.exports = (app) => {
    app.get('*', (req, res) => res.redirect('/errors/404'));
    app.all('*', (req, res) => res.status(403).send('Method not allowed'));
    return app;
};
