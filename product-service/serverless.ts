import type { AWS } from '@serverless/typescript';

import {
  getProductsHandler,
  getProductByIdHandler,
  postProductsHandler,
  catalogBatchProcessHandler,
} from '@functions';

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
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    getProductsHandler,
    getProductByIdHandler,
    postProductsHandler,
    catalogBatchProcessHandler,
  },
};

module.exports = serverlessConfiguration;
