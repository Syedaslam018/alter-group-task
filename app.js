const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const { authenticate } = require('./middleware/auth');
dotenv.config();

// Configurations
const app = express();
const port = process.env.PORT || 3000;
// const redis = new Redis({
//     host: process.env.REDIS_HOST , 
//     port: process.env.REDIS_PORT 
//   });

//   redis.on('connect', () => {
//     console.log('Connected to Redis');
// });

import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'WCrbnd8cITU4cTua1phzKszikbQ5MFDJ',
    socket: {
        host: 'redis-12868.c61.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 12868
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar


  

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

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/',(req,res) => {
  res.send({success: "Hello World"})
})

// Secure routes
app.use('/api/shorten', authenticate, urlRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);


//Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

// const serverless = require('serverless-http');
// module.exports.handler = serverless(app);


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

// Folder Structure:
// - routes/
//   - auth.js
//   - url.js
//   - analytics.js
// - controllers/
//   - authController.js
//   - urlController.js
//   - analyticsController.js
// - models/
//   - User.js
//   - Url.js