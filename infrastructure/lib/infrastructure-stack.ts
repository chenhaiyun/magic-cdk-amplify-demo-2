import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Cognito User Pool with sign-up disabled
    const userPool = new cognito.UserPool(this, 'TodoUserPool', {
      userPoolName: 'todo-user-pool',
      selfSignUpEnabled: false, // Disable self sign-up
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // Create User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'TodoUserPoolClient', {
      userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: ['http://localhost:5173'], // Add your local development URL
        logoutUrls: ['http://localhost:5173'],   // Add your local development URL
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // Create S3 bucket for hosting
    const hostingBucket = new s3.Bucket(this, 'TodoHostingBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create CloudFront OAI
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'TodoOAI');

    // Grant CloudFront OAI read access to bucket
    hostingBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [hostingBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'TodoDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(hostingBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy website contents to S3
    new s3deploy.BucketDeployment(this, 'TodoDeployment', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output values
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}