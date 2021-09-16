import { isValidEnv } from './helpers/env_helper';
import { serverRun } from './server';
import { PORT } from './helpers/env_helper';
import { scheduleJobs } from './scheduledJobs';

export default function App(): void {
  if (!isValidEnv()) {
    process.exit(1);
  }

  console.log('Application is started');
  serverRun(Number(PORT));
  scheduleJobs();
}
