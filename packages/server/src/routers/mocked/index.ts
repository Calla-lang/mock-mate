import Router from '@koa/router';
import { Database } from '@mock-mate/database';
import { ApiError, ApiSuccess } from '@mock-mate/database/dist/defs/api';
import Application, { Context, Next } from 'koa';
import { jwtLogin, jwtLogout } from '../../auth/jwt/routes/mocked';
import { verifyJWT } from '../../auth/jwt/middleware/verify';
import { verifyBasicAuth } from '../../auth/basic/middleware/verify';
import { basicAuthLogin, basicAuthLogout } from '../../auth/basic/routes/mocked';
import { bearerTokenLogin, bearerTokenLogout } from '../../auth/bearer/routes/mocked';
import { verifyBearerToken } from '../../auth/bearer/middleware/verify';
import { apiUsageMiddleware } from '../../permissions/middleware/capture';
import { SubscriptionLevel } from '@prisma/client'

class MockedApi {
    router: Router<Application.DefaultState, Application.DefaultContext>;
    databaseService: Database;
    initialised: boolean;
    permissions: SubscriptionLevel[] = [];

    constructor(private appRouter: Router) {
        this.router = new Router()
        this.databaseService = new Database()
    }

    async beforeAll(ctx: Context, next: Next) {
        if (!this.initialised) {
            this.permissions = await this.databaseService.getPermissionLevels()
        }

        await next()
    }

    async beforeRouteEnter(ctx: Context, next: Next) {
        const { nickname } = ctx.params;
        const api = await this.databaseService.apiController.getApi(nickname)
        if (api) {
            ctx.state.api = api as typeof api;
            await next()
        } else {
            ctx.status = 404
            ctx.body = `Api with nickname: ${nickname} Not Found (404)`
        }
    }

    async rateLimit(ctx: Context, next: Next) {
        const { nickname, path } = ctx.params;

        if (!nickname || !path) {
            ctx.status = 404
            ctx.body = `Api with nickname: ${nickname} and path: ${path} Not Found (404)`
            return;
        }

        const api = await this.databaseService.apiController.getApi(nickname, { withUsage: true })

        if (!api || !api.user || !api.usage) {
            await next();
            return
        }

        const limitPerSecond = this.permissions.find((permission: SubscriptionLevel) => permission.levelName === api.user.subscription)
        console.log(limitPerSecond, api.usage.length)
        if (!limitPerSecond || !limitPerSecond.requestsPerSecond) {
            ctx.status = 404
            ctx.body = `Api with nickname: ${nickname} Not Found (404): permission level not found`
            return;
        } else {
            if (limitPerSecond.requestsPerSecond <= api.usage.length) {
                ctx.status = 429
                ctx.body = `Api with nickname: ${nickname} Too Many Requests (429): limit reached`
                return;
            } else {
                await next()
                return;
            }
        }
    }

    async rateTracker(ctx: Context, next: Next) {
        // const { nickname } = ctx.params;

        await apiUsageMiddleware(ctx, next, this.databaseService)
        // const api = await this.databaseService.apiController.getApi(nickname)
        // await next()
    }

    async requiresAuth(ctx: Context, next: Next) {
        const api = ctx.state.api
        if (api.authModel) {
            let isAuthenticated = false
            switch (api.authModel.type) {
                case "jwt":
                    isAuthenticated = await verifyJWT(ctx, api.name);
                    break;
                case "basic":
                    isAuthenticated = await verifyBasicAuth(ctx, api.authModel);
                    break;
                case "bearer":
                    isAuthenticated = await verifyBearerToken(ctx, api.name, api.authModel);
                    break;
                default:
                    throw new Error("Invalid Auth format")
            }

            if (!isAuthenticated) {
                return;
            }
        }

        await next()
    }

    async login(ctx: Context) {
        const body = (ctx.req as any).body
        const api = ctx.state.api
        let isLoggedIn = false;
        console.log(api.authModel.type, api.name)
        switch (api.authModel.type) {
            case "jwt":
                isLoggedIn = await jwtLogin(ctx, body, api.name, api.authModel);
                break;
            case "basic":
                isLoggedIn = await basicAuthLogin(ctx, api.authModel);
                break;
            case "bearer":
                isLoggedIn = await bearerTokenLogin(ctx, api.name, api.authModel);
                break;


            default:
                throw new Error("Invalid Login format")
        }

        if (!isLoggedIn) {
            ctx.status = 401;
            ctx.body = 'Unauthorized';
            return false;
        }

    }

    async logout(ctx: Context) {
        const api = ctx.state.api
        switch (api.authModel.type) {
            case "jwt":
                await jwtLogout(ctx, api.name)
                break;
            case "basic":
                await basicAuthLogout(ctx)
                break;
            case "bearer":
                await bearerTokenLogout(ctx)
                break;
            default:
                throw new Error("Invalid Logout format")
        }

    }

    async getApiEndpointReturn(ctx: Context) {
        const { nickname, path } = ctx.params;

        const response = await this.databaseService.getFulfilledApi(nickname, path)

        if (response.status) {
            ctx.status = 200
            ctx.body = (response as ApiSuccess).data;
            return;
        } else {
            ctx.status = 500;
            ctx.body = (response as ApiError).message;
        }
    }

    initialise() {
        this.router.use(this.beforeAll.bind(this))
        this.router.use('/:nickname', this.beforeRouteEnter.bind(this))
        this.router.use('/:nickname', this.rateTracker.bind(this))
        this.router.post('/:nickname/login', this.login.bind(this))
        this.router.use('/:nickname/:path', this.rateLimit.bind(this))
        this.router.use('/:nickname/:path', this.requiresAuth.bind(this))
        this.router.get('/:nickname/logout', this.logout.bind(this))
        this.router.get('/:nickname/:path', this.getApiEndpointReturn.bind(this))
    }

    finalise() {
        this.appRouter.use('/mocked', this.router.routes(), this.router.allowedMethods());
    }
}

export default MockedApi