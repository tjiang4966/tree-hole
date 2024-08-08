FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# 删除可能在宿主机上安装的 node_modules
RUN rm -rf node_modules

# 在容器中重新安装依赖
RUN npm install

CMD ["npm", "run", "start:dev"]