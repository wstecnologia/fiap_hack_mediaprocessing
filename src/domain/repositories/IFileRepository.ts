
export interface IFileRepository {
  findById(id: string): Promise<File | null>;
  save(file: File): Promise<void>;
  getById(id: string): Promise<File | null>;
  delete(id: string): Promise<void>;
  list(filters?: any): Promise<File[]>;

}