import { FileController } from "../../application/interfaces/controllers/FileController";
import { IQueue } from "../../application/interfaces/Queue";
import { RabbitMQConnection } from "../../config/rabbitMQConnection";
import { AppErrors } from "../../domain/shared/error/AppErrors";
import { PropsFile } from "../../interfaces/propFile";
import { InfrastructureException } from "../exceptions/InfrastructureException";
import RedisRepository from "../repositories/RedisRepository";

export class RabbitMQFactory implements IQueue {

  constructor(
    private readonly exchange: string,
    private readonly queue: string,
    private readonly routingKey: string
  ) { }

  async publish(message: object): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();

      await channel.assertExchange(this.exchange, 'direct', { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, this.exchange, this.routingKey);

      const result = channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(message)));

      if (result) {
        console.log('Message sent to queue:', this.queue, message);
      } else {
        console.log('Message not sent to queue:', this.queue);
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
      throw new InfrastructureException(`Error starting the consumer: ${error}`);
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
              if (parsedMessage) {
                await this.processMessage(parsedMessage);
              }              
              channel.ack(msg);
            } catch (error) {
              channel.nack(msg, false, false);
              throw new InfrastructureException(`Error processing message: ${error}`);
            }
          }
        },
        { noAck: false }
      );
    } catch (error) {

      throw new InfrastructureException(`Error consuming messages from RabbitMQ: ${error}`);
    }
  }

  private async processMessage(message: PropsFile): Promise<void> {
    try {
      const fileController = new FileController(new RedisRepository());
      await fileController.saveFile(message);
    } catch (error) {      
      throw new InfrastructureException(`Error saving file and publishing status: ${error}`);
    }

  }
}