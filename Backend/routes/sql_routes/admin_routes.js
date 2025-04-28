const express = require("express");
const router = express.Router();
const {deleteDDBSES} = require("../../controllers/sqlControllers");


router.get('/api/DDBSES', deleteDDBSES);


module.exports = router;