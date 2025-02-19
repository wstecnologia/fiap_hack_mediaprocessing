import { FileEntity } from "../../domain/entities/FileEntity";
import { DomainException } from "../../domain/exception/domainException";
import { statusFile } from "../../domain/shared/constants/FileConstants";

describe("FileEntity", () => {
  
  describe("create", () => {
    it("deve criar uma instância de FileEntity com sucesso", () => {
      const fileProps = {
        file: { type: "image/png", data: [1, 2, 3] },
        user_id: "user123",
        status: statusFile.PROCESSAMENTO_ANDAMENTO,
        id_db: "db-id-123",
        email: ""
      };

      const fileEntity = FileEntity.create(fileProps);

      expect(fileEntity).toBeInstanceOf(FileEntity);
      expect(fileEntity.file).toEqual(fileProps.file);
      expect(fileEntity.user_id).toBe(fileProps.user_id);
      expect(fileEntity.status).toBe(fileProps.status);
      expect(fileEntity.id_db).toBe(fileProps.id_db);
    });

    it("deve usar o status de PROCESSAMENTO_ANDAMENTO quando não fornecido", () => {
      const fileProps = {
        file: { type: "image/png", data: [1, 2, 3] },
        user_id: "user123",
        id_db: "db-id-123",
        email:""
      };

      const fileEntity = FileEntity.create(fileProps);

      expect(fileEntity.status).toBe(statusFile.PROCESSAMENTO_ANDAMENTO);
    });
  });

  describe("fromRawData", () => {
    it("deve criar uma instância de FileEntity a partir de dados válidos", () => {
      const data = {
        file: { type: "image/png", data: [1, 2, 3] },
        user_id: "user123",
        status: statusFile.PROCESSAMENTO_ANDAMENTO,
        id_db: "db-id-123",
      };

      const fileEntity = FileEntity.fromRawData(data);

      expect(fileEntity).toBeInstanceOf(FileEntity);
      expect(fileEntity.file).toEqual(data.file);
      expect(fileEntity.user_id).toBe(data.user_id);
      expect(fileEntity.status).toBe(data.status);
      expect(fileEntity.id_db).toBe(data.id_db);
    });

    it("deve lançar DomainException se os dados forem inválidos (falta 'file')", () => {
      const invalidData = {
        user_id: "user123",
        status: statusFile.PROCESSAMENTO_ANDAMENTO,
      };

      expect(() => FileEntity.fromRawData(invalidData)).toThrowError(DomainException);
      expect(() => FileEntity.fromRawData(invalidData)).toThrowError("Arquivo inválido: Formato incorreto.");
    });

    it("deve lançar DomainException se 'file' não for um objeto ou não contiver um array em 'data'", () => {
      const invalidData = {
        file: { type: "image/png", data: "invalid" }, // 'data' deveria ser um array
        user_id: "user123",
      };

      expect(() => FileEntity.fromRawData(invalidData)).toThrowError(DomainException);
      expect(() => FileEntity.fromRawData(invalidData)).toThrowError("Arquivo inválido: Formato incorreto.");
    });

    it("deve lançar DomainException se 'user_id' não for uma string", () => {
      const invalidData = {
        file: { type: "image/png", data: [1, 2, 3] },
        user_id: 123, // user_id deve ser uma string
      };

      expect(() => FileEntity.fromRawData(invalidData)).toThrowError(DomainException);
      expect(() => FileEntity.fromRawData(invalidData)).toThrowError("user_id inválido: Deve ser uma string.");
    });

    it("deve lançar DomainException se os dados forem nulos ou não forem objetos", () => {
      const invalidData = null;

      expect(() => FileEntity.fromRawData(invalidData)).toThrowError(DomainException);
      expect(() => FileEntity.fromRawData(invalidData)).toThrowError("Dados inválidos: Esperado um objeto.");
    });
  });

  describe("updateStatus", () => {
    it("deve atualizar o status do arquivo com sucesso", () => {
      const fileProps = {
        file: { type: "image/png", data: [1, 2, 3] },
        user_id: "user123",
        status: statusFile.PROCESSAMENTO_ANDAMENTO,
        id_db: "db-id-123",
        email: ""
      };

      const fileEntity = FileEntity.create(fileProps);

      fileEntity.updateStatus(statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO);

      expect(fileEntity.status).toBe(statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO);
    });
  });
});
