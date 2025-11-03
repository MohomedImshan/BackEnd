# Use Node.js LTS version
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose the port your app runs on
EXPOSE 8800

# Start the server
CMD ["nodemon", "server.js"]
