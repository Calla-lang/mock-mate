import { verifyPassword } from "../../utils/password";
import { Context } from "koa";
import jwt from 'jsonwebtoken';
import { Api, AuthModel } from '@prisma/client'

export const failLogin = async (ctx: Context) => {
    ctx.body = "Unauthorised"
    ctx.status = 401;
}

export const jwtLogin = async (ctx: Context, body: any, apiName: string, authModel: Pick<AuthModel, "primaryKey" | "primaryValue" | "password">) => {
    const primaryKey: string = authModel.primaryKey
    const primaryValue = body[primaryKey]
    const bodyPass = body.password
    if (
        (!primaryValue || !bodyPass)
        || primaryValue !== authModel.primaryValue
    ) {
        await failLogin(ctx)
        return false;
    }
    await verifyPassword(bodyPass, authModel.password)
    const user = { [primaryKey]: primaryValue }
    const token = jwt.sign(user, `mm_${apiName.toLowerCase().replaceAll(" ", "_")}`);

    // Set cookie
    ctx.cookies.set(`mm_${apiName.toLowerCase().replaceAll(" ", "_")}`, token, {
        httpOnly: false, // Makes the cookie inaccessible to the JavaScript `Document.cookie` API
        secure: false,  // Set to true if you're using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time in milliseconds
    });

    const data = {
        message: "Logged In",
        data: user
    }

    ctx.body = data
    return true
}

export const jwtLogout = async (ctx: Context, apiName: string) => {
    ctx.cookies.set(`mm_${apiName.toLowerCase().replaceAll(" ", "_")}`, '', {
        maxAge: 0,
        httpOnly: true
    });

    const data = {
        message: "Logged Out"
    }

    ctx.body = data
}