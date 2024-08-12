FROM node:18

WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在)
COPY frontend/package*.json ./

# 复制 shared 目录
COPY shared ../shared

# 安装依赖
RUN npm install

# 复制前端源代码
COPY frontend .

EXPOSE 8080

CMD ["npm", "run", "dev"]