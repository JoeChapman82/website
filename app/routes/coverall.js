module.exports = (app) => {
    app.get('*', (req, res) => res.status(404).send('Not found'));
    app.all('*', (req, res) => res.status(403).send('Method not allowed'));
    return app;
};
