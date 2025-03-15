import { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { BatchClient } from '@speechmatics/batch-client'; // API externa de transcripción
import { PassThrough } from 'stream';

const AUDIO_BUCKET_NAME = process.env.AUDIO_BUCKET_NAME as string;
const TRANSCRIPTIONS_TABLE = process.env.TRANSCRIPTIONS_TABLE as string;
const TRANSCRIPTIONS_API_KEY = process.env.TRANSCRIPTIONS_API_KEY as string;

const s3 = new S3();
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const transcriber = new BatchClient({
  apiKey: TRANSCRIPTIONS_API_KEY,
  appId: 'transcriptions',
});

export async function processFileUpload(event: S3Event) {
  let key;

  try {
    const s3Object = event.Records[0];
    const s3Key = decodeURIComponent(
      s3Object.s3.object.key.replace(/\+/g, ' '),
    );

    if (!s3Key) throw new Error('File name error');

    const [userId, folder, file] = s3Key.split('/');
    const [fileName, fileExtension] = file.split('.');

    if (!fileName || !fileExtension) throw new Error('Invalid name format');

    const fileId = parseInt(fileName);
    const s3Params = {
      Bucket: AUDIO_BUCKET_NAME,
      Key: s3Key,
    };

    key = { userId, fileId };
    await updateTranscriptionStatus(key, 1);

    const s3Data = await s3.getObject(s3Params).promise();
    if (!s3Data.Body) throw new Error('File not found');

    const url = await s3.getSignedUrlPromise('getObject', {
      ...s3Params,
      Expires: 3600,
    });

    const transcriptionResponse = await transcriber.transcribe(
      { url },
      { transcription_config: { language: 'en' } },
      'json-v2',
    );

    await updateTranscriptionStatus(key, 2);

    const transcriptionText =
      typeof transcriptionResponse === 'string'
        ? transcriptionResponse
        : transcriptionResponse.results
            .map((r) => r.alternatives?.[0].content)
            .join(' ');

    const transcriptionFileName = `${fileId}.txt`;
    const transcriptionKey = `${userId}/transcriptions/${transcriptionFileName}`;
    const transcriptionStream = new PassThrough();
    transcriptionStream.end(transcriptionText);

    const s3UploadParams = {
      Bucket: AUDIO_BUCKET_NAME,
      Key: transcriptionKey,
      Body: transcriptionStream,
      ContentType: 'text/plain',
      ContentDisposition: 'attachment; filename=transcription.txt',
    };
    await s3.upload(s3UploadParams).promise();

    await updateTranscriptionStatus(key, 3);
  } catch (error) {
    console.error('Error processing file:', error);
    if (key) {
      await updateTranscriptionStatus(key, -1);
    }
    throw new Error('Error processing file');
  }
}

async function updateTranscriptionStatus(
  key: { userId: string; fileId: number },
  status: number,
) {
  const command = new UpdateCommand({
    TableName: TRANSCRIPTIONS_TABLE,
    Key: key,
    UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':updatedAt': new Date().toISOString(),
    },
  });

  await docClient.send(command);
}
