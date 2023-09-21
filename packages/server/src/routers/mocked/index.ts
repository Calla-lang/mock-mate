import Router from '@koa/router';
import jwt from 'jsonwebtoken';
import { DatabaseService, Database } from '@mock-mate/database';
import { ApiError, ApiSuccess } from '@mock-mate/database/dist/defs/api';
import { verifyJWT } from '../../middleware/jwt';
import Application, { Context, Next } from 'koa';
import bcrypt from 'bcrypt'
async function hashPassword(plainPassword: string) {
    try {
        const saltRounds = 10; // Number of rounds for key stretching
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }

const failLogin = async (ctx: Context) => {
    ctx.body = "Unauthorised"
    ctx.status = 401;
}

const jwtLogin = async (ctx: Context) => {
    const body: any = ctx.body
    const api = ctx.api
    const primaryKey: string = api.authPrimaryKey
    const primaryValue = body[primaryKey]
    const bodyPass = body.password
    if (
        (!primaryValue || !bodyPass)
        || primaryValue !== api.authPrimaryValue
        || bodyPass !== api.authPass
    ) {
        await failLogin(ctx)
        return;
    }
    const user = { [primaryKey]: primaryValue }
    const token = jwt.sign(user, `mm_${api.name.toLowerCase().replaceAll(" ", "_")}`);

    // Set cookie
    ctx.cookies.set(`mm_${api.name.toLowerCase().replaceAll(" ", "_")}`, token, {
        httpOnly: true, // Makes the cookie inaccessible to the JavaScript `Document.cookie` API
        secure: false,  // Set to true if you're using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time in milliseconds
    });

    const data = {
        message: "Logged In",
        data: user
    }

    ctx.body = data
}

const jwtLogout = async (ctx: Context) => {
    const api = ctx.api
    ctx.cookies.set(`mm_${api.name.toLowerCase().replaceAll(" ", "_")}`, '', {
        maxAge: 0,
        httpOnly: true
    });

    const data = {
        message: "Logged Out"
    }

    ctx.body = data
}


class MockedApi {
    router: Router<Application.DefaultState, Application.DefaultContext>;
    databaseService: Database;

    constructor(private appRouter: Router) {
        this.router = new Router()
        this.databaseService = new Database()
    }

    async getApi(nickname: string) {
        return this.databaseService.apiController.getApi(nickname)
    }

    async beforeRouteEnter(ctx: Context, next: Next) {
        const { nickname } = ctx.params;
        const api = await this.databaseService.apiController.getApi(nickname)
        ctx.state.api = api;
        await next()
    }

    async requiresAuth(ctx: Context, next: Next) {
        const api = ctx.state.api
        if (!api.public) {
            switch (api.authType) {
                case "jwt":
                    await verifyJWT(ctx, next);
                // case "basic":
                //     return `+44${generateRandomNumber()}`
                default:
                    throw new Error("Invalid format")
            }
        }

        await next()
    }

    async login(ctx: Context) {
        const api = ctx.state.api
        switch (api.authType) {
            case "jwt":
                await jwtLogin(ctx)
            // case "basic":
            //     return `+44${generateRandomNumber()}`
            default:
                throw new Error("Invalid format")
        }

    }

    async logout(ctx: Context) {
        const api = ctx.state.api
        switch (api.authType) {
            case "jwt":
                await jwtLogout(ctx)
            // case "basic":
            //     return `+44${generateRandomNumber()}`
            default:
                throw new Error("Invalid format")
        }

    }

    async getApiEndpointReturn(ctx: Context) {
        const { nickname, path } = ctx.params;

        const response = await this.databaseService.getFulfilledApi(nickname, path)

        if (response.status) {
            console.log("hasResponse")
            ctx.status = 200
            ctx.body = (response as ApiSuccess).data;
            return;
        } else {
            ctx.status = 500;
            ctx.body = (response as ApiError).message;
        }
    }

    initialise() {
        this.router.use('/:nickname', this.beforeRouteEnter.bind(this))
        this.router.use('/:nickname/:path', this.requiresAuth.bind(this))
        this.router.get('/login', this.login.bind(this))
        this.router.get('/logout', this.logout.bind(this))
        this.router.get('/:nickname/:path', this.getApiEndpointReturn.bind(this))
    }

    finalise() {
        this.appRouter.use('/mocked', this.router.routes(), this.router.allowedMethods());
    }
}

export default MockedApi