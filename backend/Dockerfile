# 1. BUILD STAGE
# This stage compiles TypeScript to JavaScript
FROM node:20-alpine AS build

# Working directory in the container
WORKDIR /app

# Copy package.json + tsconfig.json (sufficient for npm install)
COPY package.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Install dependencies (including dev-dependencies, since we still need to build here)
RUN npm install

# Copy the rest of the code
COPY src ./src
COPY migrations ./migrations
COPY .env ./.env

# Run test cases
RUN npm run test
# COPY db ./db

# Build TypeScript to dist/
RUN npm run build


# 2. RUNTIME STAGE
# This stage contains ONLY what is needed at runtime
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install only production dependencies (no TypeScript, no ts-node-dev)
RUN npm install --omit=dev

# Copy built code from the first stage
COPY --from=build /app/dist ./dist

# Port on which the server will run
ENV PORT=3001
EXPOSE 3001

# Start command for the API
CMD ["node", "dist/src/server.js"] 
