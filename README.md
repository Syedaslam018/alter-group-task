# URL Shortener API Project

## Overview
This project is a URL Shortener API that provides the following features:
- **User Authentication**: Users must sign up and log in to access the API.
- **Shorten URLs**: Create shortened versions of long URLs.
- **Redirection**: Redirect to the original URL using the shortened alias.
- **Analytics**: 
  - **Topic-Based Analytics**: Retrieve analytics for a specific topic.
  - **Overall Analytics**: View overall usage analytics.
- **Rate Limiting**: Limits requests to prevent abuse.
- **Swagger Documentation**: API documentation accessible at `/api-docs`.

## Features
1. **Authentication**:
   - Sign-up and login functionality with password hashing.
   - JWT-based token authentication for secure API access.
2. **URL Management**:
   - Shorten long URLs with optional custom aliases.
   - Redirect shortened URLs to their original links.
3. **Analytics**:
   - View analytics by topic.
   - Monitor overall application usage.
4. **Caching**:
   - Redis caching for efficient URL retrieval.
5. **Dockerized Setup**:
   - Containerized with Docker for consistent deployment.
6. **Swagger Documentation**:
   - Comprehensive API documentation for developers.

## Instructions to Run the Project

### Prerequisites
- Node.js and npm installed on your machine.
- Docker installed and running.
- Redis and MongoDB set up locally or using Docker.

### Local Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url-shortener-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=9000
   MONGO_URI=<your-mongodb-connection-string>
   BASE_URL=http://localhost:9000
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the API:
   - Base URL: `http://localhost:9000`
   - Swagger Docs: `http://localhost:9000/api-docs`

### Docker Setup

1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Base URL: `http://localhost:9000`
   - Swagger Docs: `http://localhost:9000/api-docs`

### Deployment
The application is deployed on **Onrender**. Access it via the link below:
- **Deployment URL**: `<deployment-url>`

## Challenges Faced and Solutions Implemented

1. **Redis Connection Issues**:
   - **Problem**: Redis container binding to `127.0.0.1` instead of `0.0.0.0`.
   - **Solution**: Updated the `REDIS_HOST` in environment variables to match the container’s network settings.

2. **Docker Networking**:
   - **Problem**: Services could not communicate properly in Docker.
   - **Solution**: Configured `docker-compose.yml` to use a shared network.

3. **MongoDB URI Errors**:
   - **Problem**: Incorrect MongoDB connection string format.
   - **Solution**: Updated the connection string to include the correct prefix and retry parameters.

4. **API Security**:
   - **Problem**: Unauthorized access to APIs.
   - **Solution**: Implemented JWT authentication middleware.

## Deployment URL
- Live Application: [Deployed on Onrender](<deployment-url>)

---

Feel free to explore and test the application using the provided Swagger documentation and deployment link.
