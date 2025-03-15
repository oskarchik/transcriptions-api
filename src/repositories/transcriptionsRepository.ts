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

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TRANSCRIPTIONS_TABLE = process.env.TRANSCRIPTIONS_TABLE as string;

interface TranscriptionsParams {
  userId?: string;
  limit: number;
  lastEvaluatedKey?: string;
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
