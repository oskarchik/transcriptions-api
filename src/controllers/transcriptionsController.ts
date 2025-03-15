import { Request, Response, NextFunction } from 'express';
import {
  getTranscriptions,
  generateSignedUrl,
} from '../services/transcriptionsService';

export async function searchTranscriptions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await getTranscriptions(req.query);

    return res.send(response);
  } catch (error) {
    console.error('Error in route handler', error);
    return res.status(500).send({
      message: 'Error retrieving transcriptions',
    });
  }
}

export async function getSignedUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await generateSignedUrl(req.query);

    return res.send({ signedUrl: response });
  } catch (error) {
    console.error('Error in route handler', error);
    return res.status(500).send({
      message: 'Error retrieving transcriptions',
    });
  }
}
