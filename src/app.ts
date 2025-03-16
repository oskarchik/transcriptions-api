import express from 'express';
import { config } from 'dotenv';
import router from './routes';

config();

const VERSION = process.env.VERSION;
export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(`/api/${VERSION}/`, router);

  return app;
}
