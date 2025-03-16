# Transcriptions API

A serverless API built with Node.js, Express, and AWS services for handling audio file transcriptions. This service allows users to upload audio files and get their transcriptions using Speechmatics API integration.

## Features

- Serverless architecture using AWS Lambda and API Gateway
- Audio file upload to S3
- Automatic transcription processing
- User authentication with AWS Cognito
- DynamoDB for storing transcription metadata
- Express.js for API routing
- TypeScript support

## Prerequisites

- Node.js (v20.x)
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI
- An AWS account with necessary services (S3, DynamoDB, Cognito)
- Speechmatics API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
USER_POOL_ID=your_cognito_user_pool_id
APP_CLIENT_ID=your_cognito_app_client_id
AWS_REGION=your_aws_region
CLIENT_SECRET=your_client_secret
TRANSCRIPTIONS_BUCKET_NAME=your_transcriptions_bucket_name
AUDIO_BUCKET_NAME=your_audio_bucket_name
TRANSCRIPTIONS_API_KEY=your_speechmatics_api_key
TRANSCRIPTIONS_TABLE=your_dynamodb_table_name
VERSION=v1
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

To run the project locally:

```bash
npm run dev
```

This will start the serverless-offline server on port 3005.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run staged` - Run lint-staged for pre-commit hooks

## Project Structure

```
src/
├── app.ts           # Express app configuration
├── index.ts         # Lambda handler
├── routes.ts        # API routes
├── controllers/     # Route controllers
├── services/        # Business logic
├── repositories/    # Data access layer
├── middlewares/     # Express middlewares
├── triggers/        # AWS Lambda triggers
└── error/           # Error handling
```

## AWS Resources

The project uses the following AWS services:

- **API Gateway**: HTTP API endpoints
- **Lambda**: Serverless functions
- **S3**: Audio file and transcription storage
- **DynamoDB**: Metadata storage
- **Cognito**: User authentication

## IAM Permissions

The service requires the following AWS permissions:

- DynamoDB: PutItem, GetItem, UpdateItem, DeleteItem, Query, Scan
- S3: PutObject, GetObject, ListBucket

## API Endpoints

All endpoints require authentication using AWS Cognito. Include the authentication token in the `Authorization` header.

### Get Transcriptions

```http
GET /transcriptions
```

Retrieves a list of transcriptions for a user.

**Query Parameters:**

- `userId` (optional): Filter transcriptions by user ID
- `limit` (optional): Number of items to return (default: 10)
- `lastEvaluatedKey` (optional): Key for pagination

**Response:**

```json
{
  "items": [
    {
      "fileId": "123456789",
      "userId": "user123",
      "name": "audio_file",
      "status": 3,
      "type": "wav",
      "updatedAt": "2024-03-16T10:30:00Z"
    }
  ],
  "lastEvaluatedKey": "..." // Pagination token
}
```

**Status Codes:**

- `status`: Transcription status
  - 0: Initialized
  - 1: Processing
  - 2: Transcribing
  - 3: Completed
  - -1: Error

### Get Signed URL

```http
GET /signed-url
```

Generates a pre-signed URL for uploading audio files to S3 or downloading transcriptions.

**Query Parameters:**

- `userId` (required): User ID
- `action` (required): Either 'upload' or 'download'
- `fileId` (required for download): ID of the file to download
- `fileName` (required for upload): Name of the file to upload (must end in .wav or .mp3)
- `size` (required for upload): File size in MB (max 20MB)

**Response:**

```json
{
  "signedUrl": "https://..."
}
```

**Upload Restrictions:**

- Maximum file size: 20MB
- Supported formats: .wav, .mp3
- Maximum filename length: 100 characters

**Error Responses:**

```json
{
  "message": "Error message"
}
```

### Automatic Transcription

When an audio file is uploaded to S3 using the signed URL:

1. The file is automatically processed
2. Status is updated in DynamoDB
3. Transcription is generated using Speechmatics API
4. The transcription file is stored in S3
5. Status is updated to complete (3) or error (-1)

You can track the transcription status by polling the `/transcriptions` endpoint.

## Deployment

### Prerequisites

1. Ensure you have the following AWS resources set up:

   - Cognito User Pool and App Client
   - S3 buckets for audio files and transcriptions
   - DynamoDB table for transcription metadata

2. Configure AWS credentials:

```bash
aws configure
```

### Environment Setup

1. Create a `.env` file in the project root:

```bash
cp env.example .env
```

2. Fill in all required environment variables:
   - `USER_POOL_ID`: Your Cognito User Pool ID
   - `APP_CLIENT_ID`: Your Cognito App Client ID
   - `AWS_REGION`: Your AWS region (e.g., eu-west-1)
   - `CLIENT_SECRET`: Your Cognito App Client secret
   - `TRANSCRIPTIONS_BUCKET_NAME`: S3 bucket for transcription files
   - `AUDIO_BUCKET_NAME`: S3 bucket for audio files
   - `TRANSCRIPTIONS_API_KEY`: Your Speechmatics API key
   - `TRANSCRIPTIONS_TABLE`: DynamoDB table name
   - `VERSION`: API version (e.g., v1)

### Deployment Steps

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Deploy to AWS:

```bash
serverless deploy
```

4. For a specific stage (e.g., production):

```bash
serverless deploy --stage production
```

### Post-Deployment

After successful deployment, you will receive:

- API Gateway endpoint URL
- Lambda function information
- S3 bucket configurations
- Other AWS resource details

Save these details for future reference and for configuring your client applications.

### Monitoring and Logs

To view Lambda function logs:

```bash
serverless logs -f api
serverless logs -f fileUploaded
```

To tail the logs in real-time:

```bash
serverless logs -f api -t
serverless logs -f fileUploaded -t
```

### Removing the Service

To remove all deployed resources:

```bash
serverless remove
```

**Note:** This will delete all resources created by the service. Make sure to backup any important data before removing the service.
