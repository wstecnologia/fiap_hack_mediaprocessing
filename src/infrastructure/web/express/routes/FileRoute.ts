import { FileController } from "../../../../application/interfaces/controllers/FileController";

import RedisRepository from "../../../../infrastructure/repositories/RedisRepository";
import { AuthMiddleware } from "../../middlewares/authMiddleware";
import { ExpressAdapter } from "../ExpressAdapter";

export class FileRoutes {
  private _fileRepository: RedisRepository;
  private _fileController: FileController;

  constructor(private router: any) {
    this.router = router;
    this._fileRepository = new RedisRepository();
    this._fileController = new FileController(this._fileRepository);

    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get("/files", AuthMiddleware.getMiddleware(), ExpressAdapter.adaptRoute(this.processFile.bind(this)));
  }

  private async processFile({ body }) {
    return await this._fileController.processAndUploadFiles(); 
  }
}
