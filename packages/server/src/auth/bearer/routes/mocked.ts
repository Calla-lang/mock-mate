import { Context } from "koa";
import jwt from 'jsonwebtoken';
import { Api, AuthModel } from '@prisma/client'

export const bearerTokenLogin = async (ctx: Context, apiName: string, authModel: AuthModel) => {
    const user = { [authModel.primaryKey]: authModel.primaryValue };
    const token = jwt.sign(user, `mm_${apiName.toLowerCase().replaceAll(" ", "_")}`);

    const data = {
        message: "Logged In",
        token
    };
    ctx.body = data;
    return true;
};

export const bearerTokenLogout = async (ctx: Context) => {
    // Bearer Token Authentication is stateless, so logout function doesn't really apply.
    // However, you may want to invalidate the token on the server side if needed.
    const data = {
        message: "Logged Out"
    };
    ctx.body = data;
};
