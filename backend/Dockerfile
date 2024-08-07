# backend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["yarn", "dev"]
