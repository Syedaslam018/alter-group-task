# Use Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source

# Copy source code
COPY . .

# Expose the application port
EXPOSE 9000

# Start the application
CMD ["node", "app.js"]
