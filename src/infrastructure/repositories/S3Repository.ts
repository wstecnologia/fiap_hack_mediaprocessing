import { S3 } from "aws-sdk";
import { IS3Repository } from "../../domain/repositories/IS3Repository";
import { InfrastructureException } from "../exceptions/InfrastructureException";

export class S3Repository implements IS3Repository {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor() {
    this.s3 = new S3();
    this.bucketName = process.env.AWS_S3_BUCKET_NAME; 
  }

  async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `process.env.S3_PATH/${fileName}`,
      Body: buffer,
      ContentType: "application/octet-stream",
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location; 
    } catch (error) {
      
      throw new InfrastructureException("Erro no upload para o S3");
    }
  }
}
