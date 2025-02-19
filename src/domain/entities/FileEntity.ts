import { PropsFile } from "../../interfaces/propFile";
import { DomainException } from "../exception/domainException";
import { statusFile } from "../shared/constants/FileConstants";

export class FileEntity {
  private _file: { type: string; data: number[] };
  private _user_id: string;
  private _status: string;
  private _id_db: string;
  private _email: string;

  private constructor(file: { type: string; data: number[] }, user_id: string, status: string, id_db: string, email: string ) {
    this._file = file;
    this._user_id = user_id;
    this._status = status;
    this._id_db = id_db;
    this._email = email;
  }

  static create(fileProps: PropsFile): FileEntity {
    const status = fileProps.status ?? statusFile.PROCESSAMENTO_ANDAMENTO;
    return new FileEntity(fileProps.file, fileProps.user_id, status, fileProps.id_db, fileProps.email) ;
  }

  static fromRawData(data: any): FileEntity {
    if (!data || typeof data !== "object") {
      throw new DomainException("Dados inválidos: Esperado um objeto.");
    }

    if (!data.file || typeof data.file !== "object" || !Array.isArray(data.file.data)) {
      throw new DomainException("Arquivo inválido: Formato incorreto.");
    }

    if (!data.user_id || typeof data.user_id !== "string") {
      throw new DomainException("user_id inválido: Deve ser uma string.");
    }

    return new FileEntity(
      data.file,
      data.user_id,
      data.status ?? statusFile.PROCESSAMENTO_ANDAMENTO,
      data.id_db ?? crypto.randomUUID(),
      data.email
    );
  }

  get file(): { type: string; data: number[] } {
    return this._file;
  }

  get user_id(): string {
    return this._user_id;
  }

  get status(): string {
    return this._status;
  }

  get id_db(): string {
    return this._id_db;
  }

  get email(): string {
    return this._email;
  }


  public toJSON() {
    return {
      file: this._file,
      user_id: this._user_id,
      status: this._status,
      id_db: this._id_db,
      email: this.email
    };
  }

  updateStatus(newStatus: string) {
    this._status = newStatus;
  }
}