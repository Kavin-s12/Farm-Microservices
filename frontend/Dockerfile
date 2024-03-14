# Use a non-Alpine base image
FROM node:14

WORKDIR /app

# Copy only the package.json and package-lock.json
COPY package*.json ./

# Install dependencies without devDependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

CMD ["npm", "start"]