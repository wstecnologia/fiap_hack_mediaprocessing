export interface IS3Repository {
  uploadFile(buffer: Buffer, fileName: string): Promise<string>;
}
