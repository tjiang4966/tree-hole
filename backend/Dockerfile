FROM node:18

WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在)
COPY backend/package*.json ./

# 复制 shared 目录
COPY shared ../shared

# 安装依赖
RUN npm install

# 全局安装 ts-node 和 typescript
RUN npm install -g ts-node typescript

# 复制后端源代码
COPY backend .

EXPOSE 3000

CMD ["npm", "run", "dev"]