const express = require('express');
const { getSummary, getBalances } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/balances', getBalances);

module.exports = router;
