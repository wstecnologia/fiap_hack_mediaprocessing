import { ApplicationException } from '@/application/exceptions/ApplicationException';
import { GetFileRedisUseCase } from '@/application/usecases/GetFileRedis';
import { SaveFileRedisUseCase } from '@/application/usecases/SaveFileRedix';
import { UploadFileS3UseCase } from '@/application/usecases/UploadFileS3UseCase';
import { FileEntity } from '@/domain/entities/FileEntity';
import { statusFile } from '@/domain/shared/constants/FileConstants';
import { RabbitMQFactory } from '@/infrastructure/queue/RabbitMqFactory';
import { RedisRepository } from '@/infrastructure/repositories/RedisRepository';
import { PropsFile } from '@/interfaces/propFile';

export class FileRedixController {
  private readonly saveFileRedisUseCase: SaveFileRedisUseCase;
  private readonly getFileRedisUseCase: GetFileRedisUseCase;
  private readonly uploadFileS3UseCase: UploadFileS3UseCase;
  private readonly rabbitMq: RabbitMQFactory;

  constructor(private readonly redisRepository: RedisRepository) {
    this.saveFileRedisUseCase = new SaveFileRedisUseCase(this.redisRepository);
    this.getFileRedisUseCase = new GetFileRedisUseCase(this.redisRepository);
    this.uploadFileS3UseCase = new UploadFileS3UseCase();
    this.rabbitMq = new RabbitMQFactory(process.env.RABBIT_EXCHANGE,process.env.RABBIT_QUEUE_RESPONSE,process.env.RABBIT_ROUTING_KEY_RESPONSE)
  }

  async saveFile(fileProps: PropsFile): Promise<{ message: string; file: FileEntity; s3Url?: string }> {  
    try {
      const fileEntity = FileEntity.fromRawData(fileProps);      
      await this.saveFileRedisUseCase.execute(fileEntity);      
      const fileBuffer = Buffer.from(fileEntity.file.data);
      const contentType = fileEntity.file.type;
      
      const fileName = `${process.env.S3_PATH}/${fileEntity.id_db}-${Date.now()}`;            
      const s3Url = await this.uploadFileS3UseCase.execute( fileName, fileBuffer, contentType);
      const fileStatusMessage = {
        id:fileEntity.id_db,
        status: statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO,
        link_file: s3Url,
      };
      
      this.rabbitMq.publish(fileStatusMessage)   
      
      return { message: 'Arquivo armazenado com sucesso', file: fileEntity, s3Url };
      
    } catch (error) {
      throw new ApplicationException(error.message || 'Erro ao salvar arquivo');
    }
  }

  async getFile(user_id: string, id_db: string): Promise<FileEntity> {
    try {
      const data = await this.getFileRedisUseCase.execute(user_id, id_db);

      if (!data) {
        throw new ApplicationException('Arquivo não encontrado');
      }

      return FileEntity.create(data);
    } catch (error) {
      throw new ApplicationException(error.message || 'Erro ao buscar arquivo');
    }
  }
}
