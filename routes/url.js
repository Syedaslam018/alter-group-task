const express = require('express');
const { createShortUrl, redirectUrl } = require('../controllers/urlController');
const router = express.Router();

// Create Short URL
/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URL Shortener]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to shorten.
 *               customAlias:
 *                 type: string
 *                 description: Custom alias for the short URL (optional).
 *               topic:
 *                 type: string
 *                 description: Topic for the URL (optional).
 *     responses:
 *       201:
 *         description: URL shortened successfully.
 *       400:
 *         description: Alias already exists.
 *       500:
 *         description: Server error.
 */
router.post('/', createShortUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias for the short URL.
 *     responses:
 *       302:
 *         description: Redirect successful.
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:alias', redirectUrl);

module.exports = router;