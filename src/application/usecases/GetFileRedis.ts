import RedisRepository from "../../infrastructure/repositories/RedisRepository";
import { ApplicationException } from "../exceptions/applicationException";

export class GetFileRedisUseCase {
  constructor(private readonly redisRepository: RedisRepository) {}

  async execute(userId: string, idDb: string): Promise<any> {
    const key = `user:${userId}:file:${idDb}`;
    
    try {
      
      const data = await this.redisRepository.getData(key);
      
      
      if (!data) {
        throw new ApplicationException("Arquivo não encontrado no Redis");
      }

      return data;
    } catch (error) {
      
      console.error(`Erro ao buscar arquivo de usuário ${userId} e id ${idDb}:`, error);
      throw new ApplicationException(error.message || "Erro ao recuperar o arquivo");
    }
  }
}
