import { statusFile } from '../../domain/shared/constants/FileConstants';
import { PropsFile } from '../../interfaces/propFile';

jest.mock('../../application/usecases/SaveFileRedix');
jest.mock('../../application/usecases/UploadFileS3UseCase');
jest.mock('../../infrastructure/queue/RabbitMqFactory');

describe('Simulação completa de FileController', () => {
  let saveFileRedisUseCase: jest.Mock;
  let uploadFileS3UseCase: jest.Mock;
  let rabbitMq: jest.Mock;

  beforeEach(() => {

    saveFileRedisUseCase = jest.fn().mockResolvedValue({ message: 'Dados armazenados com sucesso' });
    uploadFileS3UseCase = jest.fn().mockResolvedValue('https://s3-bucket.com/test-file.png');
    rabbitMq = jest.fn();
  });

  it('Deve simular salvar o arquivo, fazer upload no S3 e publicar no RabbitMQ', async () => {
    const fileProps: PropsFile = {
      user_id: '123',
      id_db: 'abc',
      file: { data: [116, 101, 115, 116, 45, 100, 97, 116, 97], type: 'image/png' },
      email: ""
    };


    const resultSaveFile = await saveFileRedisUseCase(fileProps);
    const resultUploadFile = await uploadFileS3UseCase(fileProps.file.data, fileProps.file.type);


    rabbitMq({
      id: 'abc',
      status: statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO,
      link_file: resultUploadFile,
    });

    expect(resultSaveFile.message).toBe('Dados armazenados com sucesso');
    expect(resultUploadFile).toBe('https://s3-bucket.com/test-file.png');
    
    expect(saveFileRedisUseCase).toHaveBeenCalledWith(fileProps);
    expect(uploadFileS3UseCase).toHaveBeenCalledWith(fileProps.file.data, fileProps.file.type);
    expect(rabbitMq).toHaveBeenCalledWith({
      id: 'abc',
      status: statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO,
      link_file: 'https://s3-bucket.com/test-file.png',
    });
  });
});
