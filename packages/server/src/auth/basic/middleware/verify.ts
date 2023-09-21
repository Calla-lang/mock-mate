import jwt from 'jsonwebtoken';
import { Context } from "koa";
import { Api, AuthModel } from '@prisma/client'
import { verifyPassword } from '../../../auth/utils/password';

export const verifyBasicAuth = async (ctx: Context, authModel: AuthModel) => {
    const authHeader = ctx.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: No Basic Auth header provided';
        return false;
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== authModel.primaryValue || !await verifyPassword(password, authModel.password)) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: Invalid Basic Auth credentials';
        return false;
    }
    ctx.state.user = { [authModel.primaryKey]: username };
    return true;
};
