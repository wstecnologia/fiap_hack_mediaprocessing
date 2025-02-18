export const filePaths = {
  '/api/files': {
    get: {
      tags: ['Files'],
      summary: 'Process and upload pending files to S3',
      description: 'This endpoint processes all pending files stored in Redis and uploads them to S3.',
      security: [{ BearerAuth: [] }], 
      responses: {
        200: {
          description: 'Files successfully processed and uploaded.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Arquivos processados e enviados com sucesso.',
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized. Token inválido ou não fornecido.' },
        500: { description: 'Internal Server Error.' },
      },
    },
  },
};

export default filePaths;