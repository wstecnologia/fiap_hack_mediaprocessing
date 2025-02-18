import { UploadFileS3UseCase } from "../../application/usecases/UploadFileS3UseCase";

// Mock do aws-sdk
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      upload: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Location: 'https://s3-bucket.com/test-file.png' }),
      }),
    })),
  };
});

describe('UploadFileS3UseCase', () => {
  let uploadFileS3UseCase: UploadFileS3UseCase;
  let s3MockUpload: jest.Mock;

  beforeEach(() => {
    process.env.AWS_S3_BUCKET = 'test-bucket';
    uploadFileS3UseCase = new UploadFileS3UseCase();

    // Acessando o mock do S3 e o método de upload diretamente
    const S3 = require('aws-sdk').S3;
    const s3Mock = S3.mock.instances[0];
    s3MockUpload = s3Mock.upload; // Acessando o método 'upload' da instância mockada
  });

  it('Deve fazer upload do arquivo e retornar a URL', async () => {
    const result = await uploadFileS3UseCase.execute(
      'test-file.png',
      Buffer.from('file-content'),
      'image/png'
    );

    // Verificando se o resultado retornado é a URL esperada
    expect(result).toBe('https://s3-bucket.com/test-file.png');
  });
  
});
