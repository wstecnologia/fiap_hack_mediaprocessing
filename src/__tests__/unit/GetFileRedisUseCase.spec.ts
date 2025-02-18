import { GetFileRedisUseCase } from "../../application/usecases/GetFileRedis";

jest.mock("../../infrastructure/repositories/RedisRepository", () => {
  return {
    getData: jest.fn().mockResolvedValue({ user_id: '123', id_db: 'abc', file: { data: 'test-data', type: 'image/png' } })
  };
});

describe('GetFileRedisUseCase', () => {
  let getFileRedisUseCase: GetFileRedisUseCase;
  beforeEach(() => {
    const { getData } = require("../../infrastructure/repositories/RedisRepository");
    getFileRedisUseCase = new GetFileRedisUseCase({ getData } as any); // Passa o método mockado
  });

  it('Deve retornar os dados do Redis corretamente', async () => {
    const result = await getFileRedisUseCase.execute('123', 'abc');   
    expect(result).toEqual({ user_id: '123', id_db: 'abc', file: { data: 'test-data', type: 'image/png' } });
    expect(require("../../infrastructure/repositories/RedisRepository").getData).toHaveBeenCalledWith('user:123:file:abc');
  });
});
