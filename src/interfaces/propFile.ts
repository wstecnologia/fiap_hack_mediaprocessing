
export interface FileData {
  type: string;
  data: number[];
}

export interface PropsFile {
  file: FileData;
  user_id: string;
  status?: string;
  id_db: string;
  email: string;
}
