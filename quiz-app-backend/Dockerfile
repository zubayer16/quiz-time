# Step 1: Base image with Node.js
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json /app/

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . /app

# Step 6: Expose necessary ports
EXPOSE 3001 5001

# Step 7: Start the relevant server
CMD ["node", "server.js"]

