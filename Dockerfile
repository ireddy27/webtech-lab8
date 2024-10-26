# Use Node.js image to build the app
FROM node:18 as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Expose the necessary port (e.g., 5000 for the Node.js server)
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
