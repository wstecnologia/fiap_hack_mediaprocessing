import { FileRedixController } from "@/application/interfaces/controllers/FileRedixController";
import { IQueue } from "@/application/interfaces/Queue";
import { RabbitMQConnection } from "@/config/rabbitMQConnection";
import { AppErrors } from "@/domain/shared/error/AppErrors";
import { PropsFile } from "@/interfaces/propFile";
import { RedisRepository } from './../repositories/RedisRepository';

export class RabbitMQFactory implements IQueue {

  constructor(
    private readonly exchange:string,
    private readonly queue:string,
    private readonly routingKey:string
  ){}

  async publish(message: object): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
 
      await channel.assertExchange(this.exchange, 'direct', { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, this.exchange, this.routingKey);
 
      const result = channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(message)));
      
      if(result){
        console.log('Message sent to queue:', this.queue, message);
      } else {
        console.log('Message not sent to queue:',this.queue);
      }
 
      await channel.close();
    } catch (error) {
      
      throw new AppErrors('Error publishing message to RabbitMQ');
    }
  }

  async on(): Promise<void> {
    try {      
      await this.consume(); 
    } catch (error) {
      console.error('Error starting the consumer:', error);
      process.exit(1); 
    }
  }

  async consume(): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
      
      await channel.assertExchange(this.exchange, 'direct', { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, this.exchange, this.routingKey);

      console.log(`Waiting for messages in queue: ${this.queue}`);
      
      channel.consume(
        this.queue,
        async (msg) => {
          
          if (msg) {
            const messageContent = msg.content.toString();
          
            try {
              const parsedMessage = JSON.parse(messageContent);   
            
              if(parsedMessage){                
               
                //const fileController = new FileRedixController(new RedisRepository()); 
                //await fileController.saveFile(parsedMessage.data)

                await this.saveFileAndPublishStatus(parsedMessage);
              }
              await this.processMessage(parsedMessage);              
              channel.ack(msg);
            } catch (error) {
              console.error('Error processing message:', error);              
              channel.nack(msg, false, false);
            }
          }
        },
        { noAck: false } 
      );
    } catch (error) {
      
      throw new AppErrors(`Error consuming messages from RabbitMQ: ${error}`);
    }    
  }

  private async processMessage(message: any): Promise<void> {    
    console.log('Processing message:', message);    
    if (!message) {
      throw new AppErrors('Message is empty.');       
    }
    console.log(`Mensagem of ${JSON.stringify( message )} processed successfully.`);
  }


  async saveFileAndPublishStatus(fileProps: PropsFile): Promise<void> {
    try {
      // Garantir que o saveFile e o publish sejam feitos de forma sequencial
      const fileController = new FileRedixController(new RedisRepository());
      await fileController.saveFile(fileProps);  // Aguarda a conclusão do processo de salvar o arquivo no Redis
      // console.log('File saved successfully in Redis and uploaded to S3');
  
      // // Publica o status após o arquivo ter sido salvo e enviado para o S3
      // const fileStatusMessage = {
      //   id: fileProps.id_db,
      //   status: statusFile.PROCESSAMENTO_CONCLUIDO_SUCESSO,
      //   link_file: fileProps.s3Url,  // Assuming the S3 URL is included in the response from saveFile
      // };
      // await this.rabbitMq.publish(fileStatusMessage);  // Publica o status da mensagem
    } catch (error) {
      console.error('Error saving file and publishing status:', error);
      throw new AppErrors('Error in saveFileAndPublishStatus');
    }
  }
}