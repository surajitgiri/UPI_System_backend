FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 5002 50052

CMD ["node", "src/server.js"]

