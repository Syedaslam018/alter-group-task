const express = require('express');
const { createShortUrl, redirectUrl } = require('../controllers/urlController');
const router = express.Router();

// Create Short URL
router.post('/', createShortUrl);

// Redirect to original URL
router.get('/:alias', redirectUrl);

module.exports = router;