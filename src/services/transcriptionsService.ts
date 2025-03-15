import { getTranscriptionsFromDB } from '../repositories/transcriptionsRepository';

interface QueryParams {
  userId?: string;
  limit?: string;
  lastEvaluatedKey?: string;
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
