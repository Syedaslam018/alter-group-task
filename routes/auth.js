const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate user via Google Sign-In
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: The ID token from Google Sign-In.
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *       400:
 *         description: Invalid token or authentication failed.
 *       500:
 *         description: Internal server error.
 */

router.post('/login', login);
module.exports = router;