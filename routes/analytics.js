const express = require('express');
const { getUrlAnalytics } = require('../controllers/analyticsController');
const router = express.Router();

// Get URL analytics
/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific short URL
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias for the short URL.
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully.
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal server error.
 */

router.get('/:alias', getUrlAnalytics);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for URLs grouped under a specific topic
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic or category of the URLs.
 *     responses:
 *       200:
 *         description: Topic analytics retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for the authenticated user's URLs
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

module.exports = router;
