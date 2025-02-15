
import { FileRepository } from "@/infrastructure/repositories/FileRepository";
import { FileController } from "@/interfaces/controllers/FileController";
import { ExpressAdapter } from "../ExpressAdapter";


export class FileRoutes {
  private _fileRepository: FileRepository  
  private _fileController: FileController
  constructor(private router: any) {
    this.router = router
    this._fileRepository = new FileRepository()    
    this._fileController = new FileController()
    
    this.initiazeRoutes()
  }

  private initiazeRoutes() {
    this.router.get("/files", ExpressAdapter.adaptRoute(this.processFile.bind(this)))         
  }

   private async processFile({ body }) {
     return await this._fileController.execute()
   }
}
