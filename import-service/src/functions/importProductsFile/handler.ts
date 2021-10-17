import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const importProductsFile: AWS['functions'][keyof AWS['functions']] = {
  handler: `${handlerPath(__dirname)}/importProductsFile.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: { parameters: { querystrings: { name: true } } },
        cors: true,
        authorizer: {
          name: 'basicAuthorizerHandler',
          arn: 'arn:aws:lambda:eu-west-1:039595892168:function:authorization-service-dev-basicAuthorizerHandler',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      }
    }
  ]
}
