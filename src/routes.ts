// src/routes/apiRoutes.ts

import { Router } from 'express';
import {
  searchTranscriptions,
  getSignedUrl,
} from './controllers/transcriptionsController';

const router = Router();

router.get('/transcriptions', searchTranscriptions);

router.get('/signed-url', getSignedUrl);

export default router;
