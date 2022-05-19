const { Router } = require('express');
const { postBrowse } = require('../controller/browse');

let browseRouter = Router();

browseRouter.post('/', postBrowse);

module.exports=browseRouter;