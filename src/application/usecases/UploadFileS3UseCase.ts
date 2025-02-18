import { S3 } from 'aws-sdk';
import { ApplicationException } from '../exceptions/applicationException';

export class UploadFileS3UseCase {
  private s3: S3;
  private bucketName: string;
  constructor() {
    this.s3 = new S3({});
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  async execute(fileName: string, fileContent: Buffer, contentType: string): Promise<string> {
    try {
  
      if (!fileName || typeof fileName !== 'string') {
        throw new ApplicationException("O nome do arquivo (Key) é inválido ou está indefinido.");
      }
      
      if (!contentType || typeof contentType !== 'string') {
        throw new ApplicationException("O ContentType é inválido ou não é uma string.");
      }
  
      if (!fileContent || !(fileContent instanceof Buffer)) {
        throw new ApplicationException("O conteúdo do arquivo é inválido.");
      }
  
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: contentType,
      };
  
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new ApplicationException(error.message || 'Erro ao fazer upload para o S3');
    }
  }
  
}
