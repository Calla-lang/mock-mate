import Router from "@koa/router";
import { ApiFull, Database, UserFull } from "@mock-mate/database";
import { Next } from "koa";
import { Context } from "vm";

const makeUrl = (base: string) => (path?: string) => `${base}${path}`;

export const addApiRoutes = (appRouter: Router, database: Database) => {
    // const urlMaker = makeUrl("/users");
    const router = new Router();
    router.use(async (ctx: Context, next: Next) => {
        const user = ctx.state.user as UserFull;
        const isAdmin = ctx.state.isAdmin as boolean;
        if (!user) {
            ctx.status = 401;
            ctx.body = "Unauthorized";
            return;
        } else {
            await next();
        }
    })

    router.get('/:apiId', async (ctx: Context) => {
        const {apiId} = ctx.params
        if (!apiId) {
            ctx.status = 404;
            ctx.body = "API not found";
            return;
        }

        const api = await database.apiController.getFullApi(apiId)
        // console.log(api, apiId)
        if (api) {
            ctx.body = api
            ctx.status = 200
        } else {
            ctx.status = 404
        }
    })


    appRouter.use('/apis', router.routes(), router.allowedMethods());
}