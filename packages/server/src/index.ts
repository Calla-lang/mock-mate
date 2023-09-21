

import Koa from 'koa';
import Router from '@koa/router';
import morgan from 'koa-morgan';

import authRouter from './routers/auth';
import MockedApi from './routers/mocked';


// Initialize Koa and Router
const app = new Koa();
app.use(morgan('dev'))

const router = new Router();
const mocker = new MockedApi(router)
mocker.initialise()
mocker.finalise()
// router.use('/sys/auth', authRouter.routes(), authRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
