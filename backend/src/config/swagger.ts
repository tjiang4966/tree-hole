import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tree Hole API',
      version: '1.0.0',
      description: 'API documentation for the Tree Hole application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // 路径是相对于 backend 目录的
};

export const swaggerSpec = swaggerJsdoc(options);