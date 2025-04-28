const express = require("express");
const router = express.Router();

const { createDB } = require('../../controllers/sqlControllers')
const {postData} = require('../../controllers/sqlControllers')
const {getDBS} = require('../../controllers/sqlControllers')
const {getTables} = require('../../controllers/sqlControllers')
const {switchDB} = require('../../controllers/sqlControllers')



router.post('/createDB', createDB)


router.post('/postData', postData)

// app.get('/getDataBases', getDBS)


router.get('/getTables', getTables)

// app.post('/switchDB', switchDB)




module.exports = router;