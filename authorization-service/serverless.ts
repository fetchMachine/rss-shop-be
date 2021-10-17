import type { AWS } from '@serverless/typescript';

import { basicAuthorizerHandler } from '@functions';
import { DEFAULT_REGION } from '@shared/constants';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    region: DEFAULT_REGION,
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },

  resources: {
    Outputs: {
      authorizationArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerHandlerLambdaFunction', 'Arn']
        },
      },
    },
  },

  functions: { basicAuthorizerHandler },
};

module.exports = serverlessConfiguration;
