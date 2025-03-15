import express from 'express';
import { config } from 'dotenv';
import router from './routes';

config();

export function createApp() {
  const app = express();

  app.use('/transcriptions', router);
  return app;
}
