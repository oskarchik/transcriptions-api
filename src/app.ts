import express from 'express';
import { config } from 'dotenv';
import router from './routes';

config();

export function createApp() {
  const app = express();

  app.get('/', async (req, res) => {
    res.send(process.env.AUDIO_BUCKET_NAME);
  });
  app.use('/', router);
  return app;
}
