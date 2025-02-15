import { RedisRepository } from "@/infrastructure/repositories/RedisRepository";

export class GetFileRedisUseCase {
  constructor(private readonly redisRepository: RedisRepository) {}

  async execute(userId: string, idDb: string) {
    const key = `user:${userId}:file:${idDb}`;
    return await this.redisRepository.getData(key);
  }
}
