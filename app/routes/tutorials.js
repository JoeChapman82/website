module.exports = (app) => {
    app.get('/', (req, res) => res.status(200).send('Tutorial routes'));
    return app;
};
