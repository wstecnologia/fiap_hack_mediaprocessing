import { SaveFileRedisUseCase } from "../../application/usecases/SaveFileRedix";
import { PropsFile } from "../../interfaces/propFile";

describe("SaveFileRedisUseCase", () => {
  let saveFileRedisUseCase: SaveFileRedisUseCase;
  let mockRedisRepository: { saveData: jest.Mock };

  beforeEach(() => {
    // Criando um mock explícito do RedisRepository
    mockRedisRepository = {
      saveData: jest.fn(),
    };

    // Injetando o mock no UseCase
    saveFileRedisUseCase = new SaveFileRedisUseCase(mockRedisRepository as any);
  });

  it("Deve salvar os dados no Redis corretamente", async () => {
    const fileProps: PropsFile = {
      user_id: "123",
      id_db: "abc",
      file: { data: [116, 101, 115, 116, 45, 100, 97, 116, 97], type: "image/png" },
      email:""
    };

    await saveFileRedisUseCase.execute(fileProps);

    expect(mockRedisRepository.saveData).toHaveBeenCalledWith(
      "user:123:file:abc",
      expect.objectContaining(fileProps)
    );
  });
});
