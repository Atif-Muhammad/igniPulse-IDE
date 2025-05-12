const express = require("express");
const router = express.Router();

const { createDB, switchDB, postData, getDBS, getTables, refTabs } = require('../../controllers/sqlControllers')




router.post('/createDB', createDB)

router.get(`/ref_tabs`, refTabs)


router.post('/postData', postData)

// app.get('/getDataBases', getDBS)


router.get('/getTables', getTables)

// app.post('/switchDB', switchDB)




module.exports = router;