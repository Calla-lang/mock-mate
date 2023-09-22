import Router from "@koa/router";
import { Database, UserFull } from "@mock-mate/database";
import { jwtLogin, jwtLogout } from "../../auth/jwt/routes/mocked";
import { Context, Next } from "koa";
import jwt from 'jsonwebtoken';

export const addAuthRoutes = (appRouter: Router, database: Database) => {
    const router = new Router();
    
    router.post<UserFull>('/login', async (ctx: Context) => {
        const body = (ctx.req as any).body
        let isLoggedIn = false;
        console.log(body)
        const authData = {
            primaryKey: 'username',
            primaryValue: body.username,
            password: body.password
        }
        isLoggedIn = await jwtLogin(ctx, body, "Mock Mate", authData);
        
        if (!isLoggedIn) {
            ctx.status = 401;
            ctx.body = 'Unauthorized';
            return false;
        }
    })
    
    appRouter.use(async (ctx: Context, next: Next) => {
        if (ctx.path === '/api/auth/login') {
            await next();
            return
        }

        const token = ctx.cookies.get(`mm_${"Mock Mate".toLowerCase().replaceAll(" ", "_")}`);
        
        if (!token) {
            ctx.status = 401;
            ctx.body = 'Unauthorized: No token provided';
            return false;
        }
    
        try {
            const decoded: any = jwt.verify(token, `mm_${"Mock Mate".toLowerCase().replaceAll(" ", "_")}`);
            const user = await database.userController.getFullUser(decoded.username)
            ctx.state.user = user; // Store decoded user data in state for other middleware/routes to use
            // if (user.subscription === "ADMIN") {
            //     ctx.state.isAdmin = true;
            // }
            // console.log(ctx.state.user)
            await next()
        } catch (err) {
            console.log(err)
            ctx.status = 401;
            ctx.body = 'Unauthorized: Invalid token';
            return false;
        }
    })

    router.get<UserFull>('/logout', async (ctx: Context) => {
        await jwtLogout(ctx,"Mock Mate");
    })


    appRouter.use('/auth', router.routes(), router.allowedMethods());
}