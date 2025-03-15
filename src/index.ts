import express from 'express';
import serverless from 'serverless-http';
import { config } from 'dotenv';

config();

const app = express();

app.get('/', async (req, res) => {
  res.send(process.env.USER_POOL_ID);
});

export const handler = serverless(app);
