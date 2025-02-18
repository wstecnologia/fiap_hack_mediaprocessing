import { FileEntity } from "../../domain/entities/FileEntity";
import RedisRepository from "../../infrastructure/repositories/RedisRepository";
import { PropsFile } from "../../interfaces/propFile";
import { ApplicationException } from "../exceptions/applicationException";

export class GetAllFilesRedisUseCase {
  constructor(private readonly redisRepository: RedisRepository) {}

  async getAllPendingFiles(): Promise<FileEntity[]> {
    try {
      
      const rawKeys = await this.redisRepository.getData("file:*");
      const keys: string[] = Array.isArray(rawKeys) ? rawKeys : [];
      if (keys.length === 0) {
        return [];
      }      
      const fileDataPromises = keys.map((key: string) => this.getFileData(key));
      const files = (await Promise.all(fileDataPromises)).filter((file) => file !== null);
      return files as FileEntity[];
    } catch (error) {
      console.error("Erro ao recuperar arquivos do Redis:", error);
      throw new ApplicationException(error.message || "Erro ao recuperar arquivos");
    }
  } 

  private async getFileData(key: string): Promise<FileEntity | null> {
    try {
      const fileData = await this.redisRepository.getData<PropsFile>(key); 
  
      if (fileData) {
        return FileEntity.create(fileData); 
      }  
      return null;
    } catch (error) {      
      throw new ApplicationException(`Erro ao recuperar arquivo para a chave ${key}`);      
    }
  }
  
}
