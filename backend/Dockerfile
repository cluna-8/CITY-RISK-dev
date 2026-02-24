FROM node:18-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install packages
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3000

CMD ["node", "server.js"]
