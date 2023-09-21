import Router from '@koa/router';
import jwt from 'jsonwebtoken';

const authRouter = new Router();

authRouter.get('/login', async (ctx) => {
    const user = {
        id: 1,
        username: 'john_doe'
    };

    // Generate JWT
    const token = jwt.sign(user, 'yourSecretKey');

    // Set cookie
    ctx.cookies.set('mm_auth_token', token, {
        httpOnly: true, // Makes the cookie inaccessible to the JavaScript `Document.cookie` API
        secure: false,  // Set to true if you're using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time in milliseconds
    });

    const data = {
        message: "Logged In"
    }

    ctx.body = data

});

authRouter.get('/logout', async (ctx) => {
    ctx.cookies.set('mm_auth_token', '', {
        maxAge: 0,
        httpOnly: true
    });

    const data = {
        message: "Logged Out"
    }

    ctx.body = data
})

export default authRouter;