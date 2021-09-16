import { DepositRepository, IDepositRepository } from './../repository/deposit_repository';
import { IDeposit } from '../models/deposit_model';
import https from 'https';
import { COURSES_PATH } from '../helpers/env_helper';
import { RouterContext } from 'koa-router';

export class DepositService {
  private readonly depositRepository: IDepositRepository;

  constructor() {
    this.depositRepository = new DepositRepository();
  }

  getById = async (ctx: RouterContext, id: number): Promise<IDeposit> => {
    if (id < 0) {
      ctx.status = 400;
      throw new Error(`id shouldn't be negative`);
    }

    const deposit: IDeposit = await this.depositRepository.getById(id);

    if (!deposit) {
      ctx.status = 400;
      throw new Error('deposit not found');
    }

    return deposit;
  };

  create = async (ctx: RouterContext, name: string, amountRUR: number): Promise<number> => {
    if (!name || !amountRUR) {
      ctx.status = 400;
      throw new Error('incorrect ownerName or amountRUR');
    }

    const courseUSD: number = await getCourseUSD();
    const amountUSD = Number((amountRUR / courseUSD).toFixed(2));

    const deposit: IDeposit = {
      ownerName: name,
      amountRUR: amountRUR,
      amountUSD: amountUSD,
    };

    const id = await this.depositRepository.create(deposit);

    if (!id) {
      throw new Error('deposit not created');
    }

    return id;
  };

  deleteById = async (ctx: RouterContext, id: number): Promise<boolean> => {
    if (id < 0) {
      ctx.status = 400;
      throw new Error(`id shouldn't be negative`);
    }

    const result = await this.depositRepository.deleteById(id);

    if (!result) {
      throw new Error('deposit not deleted');
    }

    return result;
  };

  updateAmountUSD = async (): Promise<void> => {
    const courseUSD = await getCourseUSD();

    await this.depositRepository.updateAmountUSD(courseUSD);
  };
}

const getCourseUSD = async (): Promise<number> => {
  return new Promise((resolve) => {
    const req = https.request(COURSES_PATH, (res) => {
      let allStringData = '';

      res.on('data', (data) => {
        allStringData += data.toString();
      });

      res.on('end', () => {
        const courses = JSON.parse(allStringData);
        const courseUSD = courses.Valute.USD.Value;

        resolve(courseUSD);
      });

      req.on('error', (error) => {
        console.error(error);
      });
    });

    req.end();
  });
};
