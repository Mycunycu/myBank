import { DepositService } from './../services/deposit_service';
import schedule from 'node-schedule';

export const scheduleJobs = (): void => {
  const depositService = new DepositService();

  schedule.scheduleJob('0 * * * *', function () {
    depositService.updateAmountUSD();
  });
};
