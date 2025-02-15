import Redis from 'ioredis';
import { InfrastructureException } from '../exceptions/InfrastructureException';

export class RedisRepository {  
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });

    this.redis.on('error', (err) => {
      console.error('Erro na conexão com Redis:', err);
    });
  }

  async saveData(key: string, data: any): Promise<void> {
    try {
      await this.redis.set(
        key, 
        JSON.stringify(data), 
        'EX', 
        process.env.REDIX_EXPIREIN ? parseInt(process.env.REDIX_EXPIREIN, 10) : 3600
      );
    } catch (error) {
      console.error('Erro ao armazenar no Redis:', error);
      throw new InfrastructureException('Erro ao armazenar no Redis');
    }
  }

  async getData(key: string): Promise<any> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do Redis:', error);
      throw new InfrastructureException('Erro ao recuperar dados do Redis');
    }
  }
}

export default new RedisRepository();
