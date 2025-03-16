import express from 'express';
import { config } from 'dotenv';
import cors from 'cors'
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middlewares/error';

config();

const VERSION = process.env.VERSION;
export function createApp() {
  const app = express();

  const corsOptions = {
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    
  }

  app.use(cors(corsOptions))
  app.use(helmet());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.send({
      message: 'ok',
      time: new Date().toISOString()
    })
  })

  app.use(`/api/${VERSION}/`, router);

  app.use(errorHandler);

  return app;
}
