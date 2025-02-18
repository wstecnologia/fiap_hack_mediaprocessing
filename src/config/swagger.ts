import swaggerJsdoc from 'swagger-jsdoc';
import uploadFilePath, { filePaths } from '../infrastructure/web/swagger/uploadFilePath';

const combinedPaths = {
  ...uploadFilePath,
  ...filePaths, 
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Upload API',
      version: '1.0.0',
      description: 'API para upload e gerenciamento de arquivos no S3 e Redis',
    },
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //     description: 'Local server',
    //   },
    // ],
    paths: combinedPaths, // Use os paths combinados
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Use um token JWT válido para autenticação.',
        },
      },
    },
  },
  apis: ['./src/infrastructure/webserver/swagger/**/*.ts'], 
  
};

export const swaggerSpec = swaggerJsdoc(options);