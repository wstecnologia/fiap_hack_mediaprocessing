import { SaveFileRedisUseCase } from "../../application/usecases/SaveFileRedix";
import RedisRepository from "../../infrastructure/repositories/RedisRepository";
import { PropsFile } from "../../interfaces/propFile";

describe('SaveFileRedisUseCase', () => {
  let saveFileRedisUseCase: SaveFileRedisUseCase;
  let redisRepository: RedisRepository;

  beforeEach(() => {
    redisRepository = {
      saveData: jest.fn(),
    } as unknown as RedisRepository;

    saveFileRedisUseCase = new SaveFileRedisUseCase(redisRepository);
  });

  it('Deve salvar os dados no Redis corretamente', async () => {
    const fileProps: PropsFile = {
      user_id: '123',
      id_db: 'abc',
      file: { data: [116, 101, 115, 116, 45, 100, 97, 116, 97], type: 'image/png' },
    };

    await saveFileRedisUseCase.execute(fileProps);
    
    expect(redisRepository.saveData).toHaveBeenCalledWith(
      'user:123:file:abc',
      expect.objectContaining(fileProps)
    );
  });
});
