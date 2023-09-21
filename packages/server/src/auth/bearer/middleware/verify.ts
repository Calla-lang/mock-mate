import jwt from 'jsonwebtoken';
import { Context } from "koa";
import { Api, AuthModel } from '@prisma/client'
import { verifyPassword } from '../../../auth/utils/password';

export const verifyBearerToken = async (ctx: Context, apiName: string, authModel: AuthModel) => {
    const authHeader = ctx.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: No Bearer Token provided';
        return false;
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, `mm_${apiName.toLowerCase().replaceAll(" ", "_")}`);
        // @ts-ignore
        if (decoded[authModel.primaryKey] !== authModel.primaryValue) {
            ctx.status = 401;
            ctx.body = 'Unauthorized: Invalid Bearer Token';
            return false;
        }
        ctx.state.user = decoded;
        return true;
    } catch (err) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: Invalid Bearer Token';
        return false;
    }
};

