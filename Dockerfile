# Use a Node.js base image
FROM node:lts-slim AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./backend/

# Install dependencies
RUN cd backend && npm install

# Copy the rest of the application code
COPY backend/ ./backend/
COPY public/ ./public/

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the server
CMD ["node", "backend/server.js"]
