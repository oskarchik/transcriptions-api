// src/routes/apiRoutes.ts

import { Router } from 'express';
import { searchTranscriptions } from './controllers/transcriptionsController';

const router = Router();

router.get('/', searchTranscriptions);

export default router;
