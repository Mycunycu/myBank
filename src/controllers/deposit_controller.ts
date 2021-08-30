import { DepositService } from '../services/deposit_service';
import { RouterContext } from '@koa/router';
import { logger } from '../logger';

export class DepositController {
  private readonly depositService: DepositService;

  constructor() {
    this.depositService = new DepositService();
  }

  getById = async (ctx: RouterContext): Promise<void> => {
    try {
      const { id } = ctx.params;
      logger.info(`request getById, id: ${id}`);

      const deposit = await this.depositService.getById(ctx, Number(id));
      logger.info(`result getById, deposit: ${JSON.stringify(deposit)}`);

      ctx.body = deposit;
    } catch (err) {
      onCatchError(ctx, err);
    }
  };

  create = async (ctx: RouterContext): Promise<void> => {
    try {
      const ownerName: string = ctx.request.body.ownerName;
      const amountRUR: number = Math.ceil(ctx.request.body.amountRUR);
      logger.info(`request create, ownerName: ${ownerName}, amountRUR: ${amountRUR}`);

      const createdId = await this.depositService.create(ctx, ownerName, amountRUR);
      logger.info(`result create, createdId: ${createdId}`);

      ctx.status = 201;
      ctx.body = createdId;
    } catch (err) {
      onCatchError(ctx, err);
    }
  };

  deleteById = async (ctx: RouterContext): Promise<void> => {
    try {
      const { id } = ctx.params;
      logger.info(`request deleteById, id: ${id}`);

      const result = await this.depositService.deleteById(ctx, Number(id));
      logger.info(`result deleteById, id: ${id}, result: ${result}`);

      ctx.status = 204;
    } catch (err) {
      onCatchError(ctx, err);
    }
  };
}

const onCatchError = (ctx: RouterContext, err: Error): void => {
  ctx.status = ctx.status || 500;
  ctx.body = err.message;
  ctx.app.emit('error', err, ctx);
};
