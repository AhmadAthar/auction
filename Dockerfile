# Step 1: Use Node.js base image
FROM node:alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

RUN apk add --no-cache git

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the app
COPY . .

# Step 5: Build the app
RUN npm run build

# Step 6: Expose the app port
EXPOSE 3000

# Step 7: Start the app
CMD ["npm", "run", "start:dev"]