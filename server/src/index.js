import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { restorePendingSchedules } from './services/schedulerService.js';

const bootstrap = async () => {
  await connectDatabase();
  await restorePendingSchedules();

  app.listen(env.port, () => {
    console.log(`[server] Listening on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('[fatal] Failed to bootstrap server', error);
  process.exit(1);
});
