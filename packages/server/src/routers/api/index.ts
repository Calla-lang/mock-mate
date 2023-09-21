import Router from "@koa/router"
import { Database } from "@mock-mate/database"
import { addUserRoutes } from "./user";
import { addAuthRoutes } from "./auth";
import { addApiRoutes } from "./apis";



export class CreatorService {
    router: Router;
    databaseService: Database;

    constructor(private appRouter: Router) {
        this.router = new Router()
        this.databaseService = new Database()
    }

    initialise() {
        addAuthRoutes(this.router, this.databaseService)
        addUserRoutes(this.router, this.databaseService)
        addApiRoutes(this.router, this.databaseService)

        
    }

    finalise() {
        this.appRouter.use('/api', this.router.routes(), this.router.allowedMethods());
    }
}