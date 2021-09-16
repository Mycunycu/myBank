import depositRouter from './deposit_routes';
import Router from '@koa/router';

const apiRouter = new Router({ prefix: '/api/v1' });

apiRouter.allowedMethods();
apiRouter.use('/deposit', depositRouter);

export default apiRouter.routes();
