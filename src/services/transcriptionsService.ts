import {
  getTranscriptionsFromDB,
  generateUploadUrl,
  generateDownloadUrl,
} from '../repositories/transcriptionsRepository';

interface QueryParams {
  userId?: string;
  limit?: string;
  lastEvaluatedKey?: string;
}

interface SignedUrlQueryParams {
  userId: string;
  fileName?: string;
  size?: string;
  fileId?: string;
  action: 'upload' | 'download';
}

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
    throw new Error('required param missing');
  }

  let result;
  if (action === 'download') {
    if (!fileId) {
      console.error('missing fileId');
      throw new Error('required param missing');
    }
    result = await generateDownloadUrl({ userId, fileId });
  }

  if (action === 'upload') {
    if (!fileName) {
      console.error('missing fileName');
      throw new Error('required param missing');
    }
    const [file, extension] = fileName?.split('.');
    result = await generateUploadUrl({ userId, fileExtension: extension });
  }

  return result;
}
