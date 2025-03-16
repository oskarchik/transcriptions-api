// src/routes/apiRoutes.ts

import { Router } from 'express';
import {
  searchTranscriptions,
  getSignedUrl,
} from './controllers/transcriptionsController';

import { authenticate } from './middlewares/auth';
const router = Router();

router.get('/transcriptions', authenticate, searchTranscriptions);

router.get('/signed-url', authenticate, getSignedUrl);

export default router;
