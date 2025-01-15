// Step 1: Set up a new Node.js project and install necessary dependencies
// Dependencies: Express, Mongoose, Redis, JWT, Google Sign-In, Rate Limiter, Docker, Swagger
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
dotenv.config();

// Configurations
const app = express();
const port = process.env.PORT || 3000;
const redisClient = new Redis();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Custom URL Shortener API',
      version: '1.0.0',
      description: 'API for shortening URLs with analytics and user authentication.',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => console.log('MongoDB connected.'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

// Define Mongoose schemas
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  picture: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// User Authentication Route
const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login via Google Sign-In
 *     description: Authenticate a user using Google Sign-In and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token.
 *     responses:
 *       200:
 *         description: Successful authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       400:
 *         description: Invalid ID token.
 */

authRoutes.post('/login', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(400).json({ message: 'Invalid Google ID token.' });
  }
});

app.use('/api/auth', authRoutes);

// Routes setup
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
app.use('/api/shorten', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

// Dockerize application
// Dockerfile
// FROM node:18
// WORKDIR /usr/src/app
// COPY package*.json ./
// RUN npm install
// COPY . .
// EXPOSE 3000
// CMD [ "node", "server.js" ]

// Deployment scripts to be added for AWS/Heroku.

// Note: Detailed implementation of each route, schemas, and tests will be added in respective modules.
