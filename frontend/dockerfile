#Install dependencies and build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY . .

RUN npm run build

#Create the final image
FROM node:18-alpine

WORKDIR /app

RUN addgroup -S userTemp && adduser -S userTemp -G userTemp

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

RUN chown -R userTemp:userTemp /app

USER userTemp

EXPOSE 3000

CMD ["npm", "start"]