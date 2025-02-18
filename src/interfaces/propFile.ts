// Definição da interface FileData, que descreve a estrutura do arquivo
export interface FileData {
  type: string;
  data: number[];
}

// Definição da interface PropsFile, que agora usa a interface FileData
export interface PropsFile {
  file: FileData;
  user_id: string;
  status?: string;
  id_db: string;
}
