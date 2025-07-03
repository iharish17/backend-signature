const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { signDocument } = require('../controllers/signController');

router.get('/sign/:docId', auth, signDocument);

module.exports = router;
