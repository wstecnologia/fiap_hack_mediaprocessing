import { Router } from "express";
import { FileRoutes } from "./FileRoute";
const routes = Router();

new FileRoutes(routes)

export { routes as allRoutes };

