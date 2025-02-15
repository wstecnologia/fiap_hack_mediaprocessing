
import { ProcessFileUseCase } from '@/application/usecases/ProcessFile';
import { FileEntity } from '@/domain/entities/FileEntity';
import { RabbitMQFactory } from '@/infrastructure/queue/RabbitMqFactory';
import { S3Service } from '@/infrastructure/services/S3Service';
import { SendToS3UseCase } from './../../usecases/SendToS3';

export class FileController {
  private readonly processFileUseCase: ProcessFileUseCase;
  private readonly sendToS3UseCase: SendToS3UseCase;
  private readonly fileEntity: FileEntity

  constructor() {
    const fileQueue = new RabbitMQFactory('import_files', 'fiap_file_progress', 'fiap_file');
    const s3Service = new S3Service(); 
    //this.processFileUseCase = new ProcessFileUseCase(fileQueue, s3Service);
    
  }

  async execute(): Promise<void> {
    //await this.processFileUseCase.execute(this.fileEntity);
  }

  async sendToS3(): Promise<void> {
    //await this.sendToS3UseCase.execute();

  }



}
