import { ApiError } from '../error/ApiError';
import {
  getTranscriptionsFromDB,
  generateUploadUrl,
  generateDownloadUrl,
  insertItem,
} from '../repositories/transcriptionsRepository';

interface QueryParams {
  userId?: string;
  limit?: string;
  lastEvaluatedKey?: string;
}

interface SignedUrlQueryParams {
  userId?: string;
  fileId?: string;
  fileName?: string;
  size?: string;
  action?: string;
}

const MAX_SIZE = 20 * 1024 * 1024;

export async function getTranscriptions(queryParams: QueryParams) {
  const { userId, limit = '10', lastEvaluatedKey } = queryParams;
  const limitNum = parseInt(limit, 10);

  const transcriptions = await getTranscriptionsFromDB({
    userId,
    limit: limitNum,
    lastEvaluatedKey,
  });
  return transcriptions;
}

export async function generateSignedUrl(queryParams: SignedUrlQueryParams) {
  const { userId, fileId, fileName, size, action } = queryParams;

  if (!action || !userId) {
    console.error('missing action or userId');
    throw ApiError.badRequest();
  }

  let result;
  if (action === 'download') {
    if (!fileId) {
      console.error('missing fileId');
      throw ApiError.badRequest();
    }
    result = await generateDownloadUrl({ userId, fileId });
  }

  if (action === 'upload') {
    if (!fileName || !size) {
      console.error('missing fileName or size');
      throw ApiError.badRequest();
    }

    if (parseInt(size, 10) * 1024 * 1024 > MAX_SIZE) {
      console.log('too big file');
      throw ApiError.badRequest();
    }

    if (fileName.length > 100) {
      console.log('too big name');
      throw ApiError.badRequest();
    }
    const [file, extension] = fileName?.split('.');

    if (extension !== 'wav' && extension !== 'mp3') {
      console.log('invalid format ');
      throw ApiError.badRequest();
    }

    result = await generateUploadUrl({ userId, fileExtension: extension });

    await insertItem({
      fileId: Date.now(),
      userId,
      name: file,
      status: 0,
      type: extension,
      updatedAt: new Date().toISOString(),
    });
  }

  return result;
}
