import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

export const verifyJWT = async (ctx: Context, apiName: string) => {
    // const api = ctx.api
    const token = ctx.cookies.get(`mm_${apiName.toLowerCase().replaceAll(" ", "_")}`);
    
    if (!token) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: No token provided';
        return false;
    }

    try {
        const decoded = jwt.verify(token, `mm_${apiName.toLowerCase().replaceAll(" ", "_")}`);
        ctx.state.user = decoded; // Store decoded user data in state for other middleware/routes to use
        return true;
    } catch (err) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: Invalid token';
        return false;
    }
};
