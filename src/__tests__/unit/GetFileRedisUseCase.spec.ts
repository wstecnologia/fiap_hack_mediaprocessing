import { GetFileRedisUseCase } from "../../application/usecases/GetFileRedis";
import RedisRepository from "../../infrastructure/repositories/RedisRepository";

jest.mock("../../infrastructure/repositories/RedisRepository");

describe('GetFileRedisUseCase', () => {
  let getFileRedisUseCase: GetFileRedisUseCase;
  let redisRepository: jest.Mocked<RedisRepository>;

  beforeEach(() => {
    redisRepository = new RedisRepository() as jest.Mocked<RedisRepository>;
    redisRepository.getData.mockResolvedValue({ user_id: '123', id_db: 'abc', file: { data: 'test-data', type: 'image/png' } });
    getFileRedisUseCase = new GetFileRedisUseCase(redisRepository);
  });

  it('Deve retornar os dados do Redis corretamente', async () => {
    const result = await getFileRedisUseCase.execute('123', 'abc');   
    expect(result).toEqual({ user_id: '123', id_db: 'abc', file: { data: 'test-data', type: 'image/png' } });
    expect(redisRepository.getData).toHaveBeenCalledWith('user:123:file:abc');
  });
});
