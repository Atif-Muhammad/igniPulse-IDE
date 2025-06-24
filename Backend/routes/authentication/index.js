const router = require('express').Router();

const admin_routes = require('./admin_routes.js');
const normal_routes = require('./normal_routes.js');


router.use(normal_routes)


module.exports = router