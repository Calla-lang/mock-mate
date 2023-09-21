import Router from "@koa/router";
import { Database, UserFull } from "@mock-mate/database";
import { Context } from "vm";

const makeUrl = (base: string) => (path?: string) => `${base}${path}`;

export const addUserRoutes = (appRouter: Router, database: Database) => {
    // const urlMaker = makeUrl("/users");
    const router = new Router();

    router.get<UserFull>('/:username', async (ctx: Context) => {
        const {username} = ctx.params
        if (username) {
            const user = await database.userController.getFullUser(username)
            console.log(user)
            if (user) {
                ctx.body = user
            } else {
                ctx.status = 404
            }
        }

        ctx.status = 404
    })


    appRouter.use('/users', router.routes(), router.allowedMethods());
}