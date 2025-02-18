import { RabbitMQFactory } from "../../infrastructure/queue/RabbitMqFactory";

export class ProcessFileUseCase {
  constructor(
    private readonly fileQueue: RabbitMQFactory,    
  ) {}

  async execute(): Promise<void> {
    console.log("🟢 Iniciando consumo de mensagens da fila..");
    await this.fileQueue.consume();
    
  }


}
