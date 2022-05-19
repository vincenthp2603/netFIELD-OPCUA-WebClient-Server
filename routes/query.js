const { Router } = require('express');
const { postQuery } = require('../controller/query');

let queryRouter = Router()

queryRouter.post('/', postQuery);

module.exports = queryRouter;