const express = require('express');
const { createFlat, joinFlat, getFlatDetails } = require('../controllers/flatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createFlat);
router.post('/join', joinFlat);
router.get('/me', getFlatDetails);

module.exports = router;
