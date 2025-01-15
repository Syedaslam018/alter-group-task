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

// Routes setup
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
app.use('/api/auth', authRoutes);
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
