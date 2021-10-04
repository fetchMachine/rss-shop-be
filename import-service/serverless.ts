import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions';
import { DEFAULT_REGION } from '@shared/constants';

const S3_BUCKET_ARN = 'arn:aws:s3:::rss-shop-serverless-bucket';

const PRODUCTS_SERVICE_ARN = '${cf:product-service-${self:provider.stage}.productsSqsArn}';
const PRODUCTS_SERVICE_URL = '${cf:product-service-${self:provider.stage}.productsSqsUrl}';

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
    stage: 'dev',
    region: DEFAULT_REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      { Effect: 'Allow', Action: 's3:ListBucket', Resource: S3_BUCKET_ARN },
      { Effect: 'Allow', Action: 's3:*', Resource: `${S3_BUCKET_ARN}/*` },
      { Effect: 'Allow', Action: 'sqs:SendMessage', Resource: PRODUCTS_SERVICE_ARN },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: PRODUCTS_SERVICE_URL,
    },
    lambdaHashingVersion: '20201221',
  },

  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
