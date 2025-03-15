// src/lambda/s3TriggerHandler.ts
import { S3Event } from 'aws-lambda';
import { processFileUpload } from '../services/s3Service';

export const handleS3Event = async (event: S3Event) => {
  try {
    await processFileUpload(event);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing file upload', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process file upload' }),
    };
  }
};
