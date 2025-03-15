import { Request, Response, NextFunction } from 'express';
import { getTranscriptions } from '../services/transcriptionsService';

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
