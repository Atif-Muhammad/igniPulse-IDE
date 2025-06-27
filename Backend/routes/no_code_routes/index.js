const router = require('express').Router();

const client_routes = require('./normal_routes.js')
const admin_routes = require('./admin_routes.js');
const upload = require('../../multerConf/multerConf.js');

router.use('/admin', upload.single('image') ,admin_routes);

router.use(client_routes);



module.exports = router