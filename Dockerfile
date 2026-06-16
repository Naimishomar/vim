# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend ./
RUN npm run build

# Stage 3: Production Server (with PM2)
FROM node:20-alpine
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy frontend dist
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy backend dependencies and dist
WORKDIR /app/backend
COPY backend/package*.json ./
# Install only production dependencies
RUN npm install --production
COPY --from=backend-build /app/backend/dist ./dist

# Start the server using pm2-runtime
EXPOSE 5000
CMD ["pm2-runtime", "start", "dist/index.js", "--name", "vibe-app"]
