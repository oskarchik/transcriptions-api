import {
  DynamoDBClient,
  QueryCommandInput,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  ScanCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { S3 } from 'aws-sdk';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const s3 = new S3();

const TRANSCRIPTIONS_TABLE = process.env.TRANSCRIPTIONS_TABLE as string;
const AUDIO_BUCKET_NAME = process.env.AUDIO_BUCKET_NAME as string;
const TRANSCRIPTIONS_BUCKET_NAME = process.env
  .TRANSCRIPTIONS_BUCKET_NAME as string;

interface TranscriptionsParams {
  userId?: string;
  limit: number;
  lastEvaluatedKey?: string;
}

interface SignedUrlParams {
  userId: string;
  fileExtension: string;
  fileId: string;
}

export async function getTranscriptionsFromDB(params: TranscriptionsParams) {
  const { userId, limit, lastEvaluatedKey } = params;

  let queryParams: QueryCommandInput | ScanCommandInput;
  let command;

  if (userId) {
    queryParams = {
      TableName: TRANSCRIPTIONS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: `${userId}` },
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey
        ? JSON.parse(lastEvaluatedKey)
        : undefined,
      ScanIndexForward: false,
    };
    command = new QueryCommand(queryParams);
  } else {
    queryParams = {
      TableName: TRANSCRIPTIONS_TABLE,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey
        ? JSON.parse(lastEvaluatedKey)
        : undefined,
    };
    command = new ScanCommand(queryParams);
  }
  try {
    let result = await docClient.send(command);

    let items = result.Items || [];
    let allItems = [...items];
    let lastEvaluatedKeyFromFirsQuery = result.LastEvaluatedKey;

    let newCommand;
    while (lastEvaluatedKeyFromFirsQuery && allItems.length < limit) {
      const nextQueryParams = {
        ...queryParams,
        ExclusiveStartKey: lastEvaluatedKeyFromFirsQuery,
      };

      newCommand = new QueryCommand(nextQueryParams);
      result = await docClient.send(newCommand);

      items = result.Items || [];
      allItems = [...allItems, ...items];
      lastEvaluatedKeyFromFirsQuery = result.LastEvaluatedKey;
    }

    allItems = allItems.slice(0, limit);

    return {
      items: allItems,
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error in repository', error);
    throw new Error('Error querying DynamoDB');
  }
}

export async function generateUploadUrl(
  params: Pick<SignedUrlParams, 'userId' | 'fileExtension'>,
) {
  const { userId, fileExtension } = params;

  const fileId = new Date();
  const s3Key = `${userId}/audios/${fileId}.${fileExtension}`;

  const s3Params = {
    Bucket: AUDIO_BUCKET_NAME,
    Key: s3Key,
    Expires: 60,
    ContentType: `audio/${fileExtension}`,
  };

  const signedUrl = s3.getSignedUrlPromise('putObject', s3Params);

  return signedUrl;
}

export async function generateDownloadUrl(
  params: Pick<SignedUrlParams, 'userId' | 'fileId'>,
) {
  const { userId, fileId } = params;

  const s3Key = `${userId}/transcriptions/${fileId}.txt`;

  const s3Params = {
    Bucket: TRANSCRIPTIONS_BUCKET_NAME,
    key: s3Key,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise('getObject', s3Params);

  return signedUrl;
}
