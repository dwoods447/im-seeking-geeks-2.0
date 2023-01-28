const serverless = require('serverless-http');
const defaultConfig = require('./config/default.server');
const { router, app } = require('./utils/server');
const { Request, Response } = require('express');
router.get('/', (req, res) => {
    res.json({
        message: 'Hello from the ImSeekingGeeks - API Server'
    });
});
router.get('/test', (req, res) => {
    res.json({
        message: 'Hello I am the first test route!!!!'
    });
});
app.use('/.netlify/functions/app', router);
app.listen(defaultConfig.PORT, () => console.log(`SERVER listening on port ${defaultConfig.PORT}!`));
module.exports = app;
module.exports.handler = serverless(app);
//# sourceMappingURL=app.js.map