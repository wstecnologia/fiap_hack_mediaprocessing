import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { InfrastructureException } from '../exceptions/InfrastructureException';

export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
  }

  public async uploadFile(filePath: string): Promise<string> {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: this.bucketName,
      Key: `uploads/${fileName}`,
      Body: fileContent,
      ACL: 'private',
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location;
    } catch (error) {

      throw new InfrastructureException('Erro no upload para S3');
    }
  }
}
