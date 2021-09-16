import Router from '@koa/router';
import { DepositController } from '../controllers/deposit_controller';

const depositRouter = new Router();
const depositController: DepositController = new DepositController();

depositRouter.get('/:id', depositController.getById);
depositRouter.post('/', depositController.create);
depositRouter.delete('/:id', depositController.deleteById);
depositRouter.allowedMethods();

export default depositRouter.routes();
