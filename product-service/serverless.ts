import type { AWS } from '@serverless/typescript';

import {
  getProductsHandler,
  getProductByIdHandler,
  postProductsHandler,
  catalogBatchProcessHandler,
} from '@functions';

import { DEFAULT_REGION } from '@shared/constants';

const QueueName = 'catalogItemsQueue';
const TopicName = 'createProductTopic';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],

  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName,
          ReceiveMessageWaitTimeSeconds: 20,
        }
      },

      SNSTopic: { Type: 'AWS::SNS::Topic', Properties: { TopicName } },

      SNSSubscription: {
          Type: 'AWS::SNS::Subscription',
          Properties: {
            Endpoint: 'yuntsov89@mail.ru',
            Protocol: 'email',
            TopicArn: { Ref: 'SNSTopic' },
          },
      },

      SNSSubscriptionImportant: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'yuntsov89_improtant@mail.ru',
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
          FilterPolicy: { price: [{ numeric: ['>', 1000] }] },
        },
      },
    },

    Outputs: {
      productsSqsArn: { Value: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] } },
      productsSqsUrl: { Value: { Ref: 'SQSQueue' } },
    },
  },

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: DEFAULT_REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: { Ref: 'SNSTopic' },
    },

    lambdaHashingVersion: '20201221',

    iamRoleStatements: [
      { Effect: 'Allow', Action: 'sqs:*', Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] } },
      { Effect: 'Allow', Action: 'sns:*', Resource: { Ref: 'SNSTopic' } },
    ],
  },

  functions: {
    getProductsHandler,
    getProductByIdHandler,
    postProductsHandler,
    catalogBatchProcessHandler,
  },
};

module.exports = serverlessConfiguration;
