import { FileEntity } from "@/domain/entities/FileEntity";
import { S3Repository } from "@/infrastructure/repositories/S3Repository";
import { ApplicationException } from "../exceptions/ApplicationException";

export class SendToS3UseCase {
  constructor(  
    private readonly s3Repository: S3Repository
  ) {}
   private async execute(fileEntity: FileEntity): Promise<void> {
     try {
       //const fileUrl = await this.s3Repository.uploadFile(fileEntity, fileName);
       
       //const fileUrl = ''
       //console.log(`Arquivo enviado para S3 com sucesso: ${fileUrl}`);
     } catch (error) {
      throw new ApplicationException(`Erro ao enviar arquivo para S3: ${error}`);
       
     }
   }
   
  }