const express = require('express');
const { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics} = require('../controllers/analyticsController');
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
 *     summary: Get analytics for a specific topic.
 *     parameters:
 *       - name: topic
 *         in: path
 *         required: true
 *         description: The topic to retrieve analytics for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved topic analytics.
 *       404:
 *         description: Topic not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/topic/:topic', getTopicAnalytics);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for all topics.
 *     responses:
 *       200:
 *         description: Successfully retrieved overall analytics.
 *       500:
 *         description: Internal server error.
 */
router.get('/overall', getOverallAnalytics);

module.exports = router;
