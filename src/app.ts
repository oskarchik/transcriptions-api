import express from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middlewares/error';

config();

const VERSION = process.env.VERSION;
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.use(`/api/${VERSION}/`, router);

  app.use(errorHandler);

  return app;
}
