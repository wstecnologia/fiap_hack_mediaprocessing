import { FileEntity } from "@/domain/entities/FileEntity";
import { RedisRepository } from "@/infrastructure/repositories/RedisRepository";
import { PropsFile } from "@/interfaces/propFile";

export class SaveFileRedisUseCase {
  constructor(private readonly redisRepository: RedisRepository) {}

  async execute(fileProps: Omit<PropsFile, 'status'>): Promise<{ message: string; data: PropsFile }> {
    const fileEntity = FileEntity.create(fileProps);
    const key = `user:${fileProps.user_id}:file:${fileProps.id_db}`;

    await this.redisRepository.saveData(key, fileEntity.toJSON());

    return { message: 'Dados armazenados com sucesso', data: fileEntity.toJSON() };
  }
}
