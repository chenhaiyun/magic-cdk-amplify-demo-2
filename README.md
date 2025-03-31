# Magic CDK Amplify Demo 2

A React TypeScript TODO application with AWS Cognito authentication and CDK deployment.

## Prerequisites

- Node.js 20.x
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your AWS Cognito configuration:
```
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=your-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-user-pool-client-id
```

3. Start the development server:
```bash
npm run dev
```

## Deployment

1. Install CDK dependencies:
```bash
cd infrastructure
npm install
```

2. Deploy the infrastructure:
```bash
cdk deploy
```

3. After deployment, CDK will output the following values:
- UserPoolId
- UserPoolClientId
- CloudFrontURL

4. Update your `.env` file with the new values and rebuild the application:
```bash
npm run build
```

5. Deploy the updated application:
```bash
cdk deploy
```

## Features

- User authentication with AWS Cognito
- Create, read, update, and delete TODO items
- Local storage for TODO items
- Secure deployment with CloudFront and S3
- Protected S3 bucket (no public access)

## Architecture

- Frontend: React + TypeScript
- Authentication: AWS Cognito
- Hosting: CloudFront + S3
- Infrastructure as Code: AWS CDK v2

## Security

- S3 bucket is not publicly accessible
- CloudFront uses Origin Access Identity to access S3
- HTTPS-only access through CloudFront
- User authentication required to access the application
```
