# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend runtime with frontend static files
FROM node:20-alpine
WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

# Place the frontend build where server.js expects it: ../frontend/dist
COPY --from=frontend-builder /build/frontend/dist /usr/src/frontend/dist

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
