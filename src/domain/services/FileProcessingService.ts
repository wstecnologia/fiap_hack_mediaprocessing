import { s3Config } from "@/config/S3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";


interface FileMessage {
  fileName: string;
  fileContent: string;
}

export class FileProcessingService {
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || "default-bucket";
  }

  async processFile(message: FileMessage): Promise<void> {
    try {
      console.log("Processing file:", message);

      if (!message || !message.fileName || !message.fileContent) {
        throw new Error("Invalid message format");
      }

      await this.uploadToS3(message.fileName, message.fileContent);
      console.log("File successfully uploaded to S3:", message.fileName);
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  }

  private async uploadToS3(fileName: string, fileContent: string): Promise<void> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: "application/octet-stream",
      };

      await s3Config.send(new PutObjectCommand(params));
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  }
}
