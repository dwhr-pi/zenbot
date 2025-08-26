FROM node:18-alpine

WORKDIR /app

# Install Git and other dependencies
RUN apk add --no-cache git python3 make g++

# Clone Zenbot repository
RUN git clone https://github.com/carlos8f/zenbot.git .

# Install Zenbot dependencies
RUN npm install

# Expose the Zenbot UI port
EXPOSE 8080

CMD ["node", "zenbot.js"]

