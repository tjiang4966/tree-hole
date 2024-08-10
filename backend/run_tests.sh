#!/bin/bash

# 启动测试环境
docker-compose -f docker-compose.test.yml up -d

# 等待数据库准备就绪
echo "Waiting for database to be ready..."
sleep 10

# 运行测试
docker-compose -f docker-compose.test.yml run backend_test npm run test

# 关闭测试环境
docker-compose -f docker-compose.test.yml down