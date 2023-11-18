const express = require('express');
const {addLog, searchLogs} = require('../controllers/logController'); 

const router = express.Router();

router.post('/addLogs', addLog);
router.post('/searchLogs', searchLogs);

module.exports = router;
