

import Koa from 'koa';
import Router from '@koa/router';
import morgan from 'koa-morgan';
import multer from 'koa-multer';
// import bodyParser from 'koa-bodyparser';
import authRouter from './routers/auth';
import MockedApi from './routers/mocked';
import { CreatorService } from './routers/api';

const start = async () => {
    const app = new Koa();

    app.use(morgan('dev'))

    const upload = multer();
    app.use(upload.any()); 

    const router = new Router();

    const mocker = new MockedApi(router)
    mocker.initialise()
    mocker.finalise()

    const creator = new CreatorService(router)
    creator.initialise()
    creator.finalise()

    app.use(router.routes()).use(router.allowedMethods());

    return app
}

start().then((app) => {

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
})
