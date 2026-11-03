# Build the React client
FROM node:26-alpine AS client
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Run the Express API, which also serves the built client
FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client /app/client/build /app/client/build
EXPOSE 9000
USER node
CMD ["node", "index.js"]
