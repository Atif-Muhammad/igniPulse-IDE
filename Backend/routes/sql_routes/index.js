const router = require('express').Router();

const client_routes = require('./client_routes.js')
const admin_routes = require('./admin_routes.js')

router.use(client_routes);

router.use(admin_routes)


module.exports = router