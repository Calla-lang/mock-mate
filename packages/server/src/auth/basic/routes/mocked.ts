import { verifyBasicAuth } from "../middleware/verify";
import { Context } from "koa";
import { Api, AuthModel } from '@prisma/client'
export const basicAuthLogin = async (ctx: Context, authModel: AuthModel) => {
    const success = await verifyBasicAuth(ctx, authModel);
    if (success) {
        const data = {
            message: "Logged In",
            data: { [authModel.primaryKey]: authModel.primaryValue }
        };
        ctx.body = data;
    }
    return success;
};

export const basicAuthLogout = async (ctx: Context) => {
    // Basic Auth doesn't require explicit logout as it's stateless.
    const data = {
        message: "Logged Out"
    };
    ctx.body = data;
};
