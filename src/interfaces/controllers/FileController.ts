import { ProcessFileUseCase } from "@/application/usecases/ProcessFile";
import { RabbitMQFactory } from "@/infrastructure/queue/RabbitMqFactory";

export class FileController {
  private readonly processFileUseCase: ProcessFileUseCase;

  constructor(
    private readonly fileQueue: RabbitMQFactory = new RabbitMQFactory("import_files", "fiap_file_progress", "fiap_file"),
  ) {
    this.processFileUseCase = new ProcessFileUseCase(fileQueue);
  }

  async execute(): Promise<void> {
    await this.processFileUseCase.execute();
  }
}
