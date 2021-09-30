import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions';

const S3_BUCKET_ARN = 'arn:aws:s3:::rss-shop-serverless-bucket';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      { Effect: 'Allow', Action: 's3:ListBucket', Resource: [S3_BUCKET_ARN] },
      { Effect: 'Allow', Action: 's3:*', Resource: [`${S3_BUCKET_ARN}/*`] },
      { Effect: 'Allow', Action: 'sqs:SendMessage', Resource: 'arn:aws:sqs:eu-west-1:039595892168:catalogItemsQueue' },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: 'https://sqs.eu-west-1.amazonaws.com/039595892168/catalogItemsQueue',
    },
    lambdaHashingVersion: '20201221',
  },

  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
