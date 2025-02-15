///TODO: Refatora --- Implementar a classe S3FileRepository

import { IFileRepository } from '@/domain/repositories/IFileRepository';
import AWS from 'aws-sdk';


export class FileRepository implements IFileRepository {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3();
  }
  findById(id: string): Promise<File | null> {
    throw new Error('Method not implemented.');
  }
  save(file: File): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<File | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  list(filters?: any): Promise<File[]> {
    throw new Error('Method not implemented.');
  }

  //  async findById(id: string): Promise<File | null> {
  // //   // Aqui, você consultaria seu banco de dados ou outro sistema de armazenamento
  //    return new File(id, `s3://mybucket/${id}`, 'pendente');
  //  }

  // async save(file: File): Promise<void> {
  //   // Aqui você salvaria o arquivo no banco de dados ou no repositório
  // }
}
