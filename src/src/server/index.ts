import Koa from 'koa';
import apiRouter from '../routes';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { logger } from '../logger';

export function serverRun(port: number): void {
  const server = new Koa();

  server.use(bodyParser());
  server.use(cors());
  server.use(apiRouter);
  server.listen(port);

  console.log('Server is started on PORT: ', port);

  server.on('error', (err, ctx) => {
    logger.error('Server error:', ctx, err);
  });
}
