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
    const { userId, fileId, fileName, size, action } = req.query as {
      userId?: string;
      fileId?: string;
      fileName?: string;
      size?: string;
      action?: 'upload' | 'download';
    };
    const response = await generateSignedUrl({
      userId,
      fileId,
      fileName,
      size,
      action,
    });

    return res.send({ signedUrl: response });
  } catch (error) {
    console.error('Error in route handler', error);
    return res.status(500).send({
      message: 'Error retrieving transcriptions',
    });
  }
}
