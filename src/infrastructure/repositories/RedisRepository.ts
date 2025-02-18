import Redis from 'ioredis';

class RedisRepository {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost', 
      port: Number(process.env.REDIS_PORT) || 6379,
      socketTimeout: 1000, 
    });

   
    this.redis.on('error', (err) => console.error('Erro na conexão com Redis:', err));
  }
  
  async saveData<T>(key: string, data: T, expireInSeconds: number = 3600): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', expireInSeconds);
    } catch (error) {
      console.error(`Erro ao armazenar dados no Redis [Key: ${key}]`, error);
      throw new Error('Erro ao armazenar dados no Redis');
    }
  }
  
  async getData<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Erro ao recuperar dados do Redis [Key: ${key}]`, error);
      throw new Error('Erro ao recuperar dados do Redis');
    }
  }
  
  async getAllKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error(`Erro ao buscar chaves no Redis [Pattern: ${pattern}]`, error);
      throw new Error('Erro ao buscar chaves no Redis');
    }
  }
  
  async deleteData(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Erro ao deletar chave no Redis [Key: ${key}]`, error);
      throw new Error('Erro ao deletar dados do Redis');
    }
  }
}

export default RedisRepository; // Exportando a classe, não a instância
