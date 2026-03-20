FROM node:22-slim

WORKDIR /app

# Instala apenas as dependências de produção do backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copia o código do backend
COPY backend/ .

EXPOSE 3001

CMD ["node", "server.js"]
