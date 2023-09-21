import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

export const verifyJWT = async (ctx: Context, next: Next) => {
    const api = ctx.api
    const token = ctx.cookies.get(`mm_${api.name.toLowerCase().replaceAll(" ", "_")}`);
    console.log("token", token)
    if (!token) {
        // console.log("")
        ctx.status = 401;
        ctx.body = 'Unauthorized: No token provided';
        return false;
    }

    try {
        const decoded = jwt.verify(token, `mm_${api.name.toLowerCase().replaceAll(" ", "_")}`);
        console.log("decoded", decoded)
        ctx.state.user = decoded; // Store decoded user data in state for other middleware/routes to use
        await next()
    } catch (err) {
        ctx.status = 401;
        ctx.body = 'Unauthorized: Invalid token';
    }
};
